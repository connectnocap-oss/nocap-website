"""IndexNow notifications for content changes made in the admin CMS.

When the owner saves site content, the homepage (the only page that renders CMS
content) is submitted to IndexNow so Bing and the other IndexNow engines recrawl it.

Best effort by design: failures are logged and never affect the save. Pings are
throttled through MongoDB (one per THROTTLE window) because serverless instances
do not share memory, so a burst of edits produces a single notification.

Env (all optional):
  INDEXNOW_KEY       defaults to the key published at https://itsnocap.com/<key>.txt
  INDEXNOW_SITE      defaults to https://itsnocap.com
  INDEXNOW_DISABLED  set to "1" to turn notifications off
"""
import logging
import os
from datetime import datetime, timedelta, timezone

import httpx

logger = logging.getLogger(__name__)

ENDPOINT = "https://api.indexnow.org/indexnow"
DEFAULT_KEY = "0c1fecd8097072d4cd3d120e522fb229"  # public by design (served as a .txt file)
DEFAULT_SITE = "https://itsnocap.com"
THROTTLE = timedelta(minutes=5)
TIMEOUT_SECONDS = 3.0


def _settings() -> tuple[str, str, bool]:
    key = (os.environ.get("INDEXNOW_KEY") or DEFAULT_KEY).strip()
    site = (os.environ.get("INDEXNOW_SITE") or DEFAULT_SITE).strip().rstrip("/")
    disabled = os.environ.get("INDEXNOW_DISABLED", "").strip().lower() in {"1", "true", "yes"}
    return key, site, disabled


async def _claim_slot(db) -> bool:
    """Atomically take the next notification slot; False if one was used within THROTTLE."""
    now = datetime.now(timezone.utc).replace(tzinfo=None)  # Mongo stores naive UTC
    cutoff = now - THROTTLE
    try:
        result = await db.meta.update_one(
            {"id": "indexnow", "$or": [{"last_ping": {"$lt": cutoff}}, {"last_ping": {"$exists": False}}]},
            {"$set": {"last_ping": now}},
        )
        if result.modified_count:
            return True
        # No document yet: create it. Two saves racing on the very first ping may both
        # send one; that is harmless and only possible once.
        if await db.meta.count_documents({"id": "indexnow"}, limit=1) == 0:
            await db.meta.insert_one({"id": "indexnow", "last_ping": now})
            return True
        return False
    except Exception as exc:  # throttling must never block a save
        logger.warning("indexnow throttle check failed, skipping ping: %s", exc)
        return False


async def notify_content_changed(db, paths: tuple[str, ...] = ("/",)) -> str:
    """Submit the given site paths to IndexNow. Returns a short status for logs/tests."""
    key, site, disabled = _settings()
    if disabled:
        return "disabled"
    if not await _claim_slot(db):
        return "throttled"
    host = site.split("://", 1)[-1]
    body = {
        "host": host,
        "key": key,
        "keyLocation": f"{site}/{key}.txt",
        "urlList": [f"{site}{p}" for p in paths],
    }
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as http:
            res = await http.post(ENDPOINT, json=body)
        if res.status_code in (200, 202):
            logger.info("indexnow ping accepted (%s) for %s", res.status_code, body["urlList"])
            return f"sent:{res.status_code}"
        logger.warning("indexnow ping rejected: HTTP %s %s", res.status_code, res.text[:200])
        return f"rejected:{res.status_code}"
    except Exception as exc:
        logger.warning("indexnow ping failed: %s", exc)
        return "error"
