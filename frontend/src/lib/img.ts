// Responsive sizes for CMS uploads. The backend resizes /api/files/... to WebP when
// asked for one of these widths (see backend/lib/images.py). Other URLs (bundled
// assets, external images, blob: previews) are returned untouched.
export type ImgWidth = 256 | 480 | 800 | 1200 | 1600 | 2000;

const isCmsFile = (src?: string) => !!src && src.includes("/api/files/") && !src.includes("?");

export const sized = (src: string, w: ImgWidth) => (isCmsFile(src) ? `${src}?w=${w}` : src);

export const srcSet = (src: string, widths: ImgWidth[]) =>
  isCmsFile(src) ? widths.map((w) => `${src}?w=${w} ${w}w`).join(", ") : undefined;
