"""Cloudflare R2 object storage using its S3-compatible API.

Keeps the existing NoCap storage interface: init_storage(), put_object(), get_object().
Required environment variables:
  R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT_URL
Optional: R2_REGION (defaults to 'auto')
"""

import os
from functools import lru_cache
from urllib.parse import quote

import boto3
from botocore.config import Config


APP_NAME = "nocap"


def _required_env(name: str) -> str:
    value = (os.environ.get(name) or "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


@lru_cache(maxsize=1)
def _client():
    return boto3.client(
        "s3",
        endpoint_url=_required_env("R2_ENDPOINT_URL"),
        aws_access_key_id=_required_env("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=_required_env("R2_SECRET_ACCESS_KEY"),
        region_name=(os.environ.get("R2_REGION") or "auto").strip(),
        config=Config(signature_version="s3v4", retries={"max_attempts": 3, "mode": "standard"}),
    )


def init_storage(force: bool = False):
    """Initialize and validate access to the configured R2 bucket."""
    bucket = _required_env("R2_BUCKET_NAME")
    _client().head_bucket(Bucket=bucket)
    return bucket


def put_object(path: str, data: bytes, content_type: str) -> dict:
    """Store bytes at the supplied object key and return legacy-compatible metadata."""
    if not path or path.startswith("/") or ".." in path.split("/"):
        raise ValueError("Invalid object path")
    bucket = _required_env("R2_BUCKET_NAME")
    _client().put_object(
        Bucket=bucket,
        Key=path,
        Body=data,
        ContentType=content_type or "application/octet-stream",
    )
    return {"path": path, "size": len(data)}


def get_object(path: str) -> tuple[bytes, str]:
    """Retrieve an object and return (bytes, content_type), matching the old interface."""
    bucket = _required_env("R2_BUCKET_NAME")
    response = _client().get_object(Bucket=bucket, Key=path)
    body = response["Body"]
    try:
        data = body.read()
    finally:
        body.close()
    return data, response.get("ContentType", "application/octet-stream")
