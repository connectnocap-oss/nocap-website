import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, Depends, UploadFile, File, HTTPException, Request
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Any, List, Optional
import uuid
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
from lib.db import client, db, ensure_indexes
from lib.storage import init_storage, put_object, get_object, APP_NAME
from lib.email import send_enquiry_notification
from lib.indexnow import notify_content_changed

JWT_ALGORITHM = "HS256"
LOCKOUT_THRESHOLD = 5
LOCKOUT_MINUTES = 15


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_owner_token() -> str:
    payload = {
        "sub": "owner",
        "role": "admin",
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def require_admin(request: Request):
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "owner@nocap.local")
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Owner",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})


# Startup runs before the yield, shutdown after it. Add your own setup/teardown here.
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())  # background: a big index build must not block boot
    try:
        await asyncio.to_thread(init_storage)
        logger.info("object storage initialized")
    except Exception as exc:
        logger.error("object storage init failed: %s", exc)
    await seed_admin()
    yield
    client.close()


# Create the main app without a prefix
app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class EnquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    brand: Optional[str] = Field(default=None, max_length=120)
    message: str = Field(min_length=1, max_length=2000)

class Enquiry(EnquiryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContentUpdate(BaseModel):
    data: dict[str, Any]

class LoginInput(BaseModel):
    password: str = Field(min_length=1, max_length=200)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/enquiries", response_model=Enquiry, status_code=201)
async def create_enquiry(input: EnquiryCreate):
    enquiry = Enquiry(**input.model_dump())
    _ = await db.enquiries.insert_one(enquiry.model_dump())
    try:
        await send_enquiry_notification(
            name=enquiry.name, email=enquiry.email, brand=enquiry.brand, message=enquiry.message
        )
    except Exception as exc:
        logger.error("enquiry email failed: %s", exc)
    return enquiry

@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries(_: None = Depends(require_admin)):
    docs = await db.enquiries.find().sort("created_at", -1).to_list(500)
    return [Enquiry(**doc) for doc in docs]

@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request):
    identifier = f"{request.client.host if request.client else 'unknown'}:admin"
    now = datetime.now(timezone.utc).replace(tzinfo=None)  # Mongo stores naive UTC
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= LOCKOUT_THRESHOLD:
        locked_until = attempt.get("locked_until")
        if locked_until and locked_until > now:
            raise HTTPException(status_code=429, detail="Too many attempts. Try again in a few minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})
    admin_email = os.environ.get("ADMIN_EMAIL", "owner@nocap.local")
    user = await db.users.find_one({"email": admin_email})
    if user is None or not verify_password(input.password, user["password_hash"]):
        count = (attempt.get("count", 0) if attempt else 0) + 1
        update: dict[str, Any] = {"count": count}
        if count >= LOCKOUT_THRESHOLD:
            update["locked_until"] = now + timedelta(minutes=LOCKOUT_MINUTES)
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Wrong password")
    await db.login_attempts.delete_one({"identifier": identifier})
    return {"token": create_owner_token()}

@api_router.get("/auth/me")
async def auth_me(_: None = Depends(require_admin)):
    return {"role": "admin"}

@api_router.post("/uploads", status_code=201)
async def upload_file(file: UploadFile = File(...), _: None = Depends(require_admin)):
    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=415, detail="Only image uploads are allowed")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 8MB)")
    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "png"
    path = f"{APP_NAME}/uploads/site/{uuid.uuid4()}.{ext}"
    result = await asyncio.to_thread(put_object, path, data, content_type)
    _ = await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result["size"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": result["path"], "url": f"/api/files/{result['path']}"}

@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = await asyncio.to_thread(get_object, path)
    return Response(
    content=data,
    media_type=record.get("content_type") or content_type,
    headers={
        "Cache-Control": "public, max-age=31536000, immutable"
    }
)

@api_router.get("/content")
async def get_content():
    doc = await db.content.find_one({"id": "site"})
    return {"data": (doc or {}).get("data", {})}

@api_router.put("/content")
async def put_content(update: ContentUpdate, _: None = Depends(require_admin)):
    _ = await db.content.update_one({"id": "site"}, {"$set": {"data": update.data}}, upsert=True)
    try:
        # Tell IndexNow the homepage changed (throttled, best effort, never fails the save).
        await notify_content_changed(db)
    except Exception as exc:
        logger.error("indexnow notification failed: %s", exc)
    return {"ok": True}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
