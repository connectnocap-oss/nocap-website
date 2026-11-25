"""On-the-fly image resizing for /api/files/...?w=<width>.

CMS uploads are stored untouched in R2. When the site asks for a width, the
original is downscaled (never upscaled) and re-encoded as WebP. Responses are
cached by the CDN for a year, so each size is computed once per image.
"""
from io import BytesIO

from PIL import Image, ImageOps

# Widths the frontend may request; anything else is rejected so the cache
# cannot be flooded with arbitrary sizes.
ALLOWED_WIDTHS = frozenset({256, 480, 800, 1200, 1600, 2000})
RESIZABLE_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})
WEBP_QUALITY = 78


def resize_to_webp(data: bytes, width: int) -> tuple[bytes, str] | None:
    """Return (webp_bytes, "image/webp"), or None when the original is the better choice."""
    with Image.open(BytesIO(data)) as im:
        if getattr(im, "is_animated", False):
            return None
        if im.format == "JPEG":
            # Let the JPEG decoder skip detail we are about to throw away (big speedup on 6000px photos).
            im.draft("RGB", (width, max(1, round(im.height * width / im.width))))
        img = ImageOps.exif_transpose(im)
        if img.width > width:
            img.thumbnail((width, 100_000), Image.Resampling.LANCZOS)
        has_alpha = img.mode in ("RGBA", "LA", "PA") or (img.mode == "P" and "transparency" in img.info)
        img = img.convert("RGBA" if has_alpha else "RGB")
        out = BytesIO()
        img.save(out, "WEBP", quality=WEBP_QUALITY, method=4)
    encoded = out.getvalue()
    if len(encoded) >= len(data):
        return None  # already small; keep the original
    return encoded, "image/webp"
