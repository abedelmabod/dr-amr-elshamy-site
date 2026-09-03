import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getHeadlessDb } from "../../../../db/headless-db";
import { media } from "../../../../db/headless-schema";
import { isAdmin } from "../../_lib";

export const runtime = "nodejs";

const maxUploadBytes = 5 * 1024 * 1024;
const uploadsRoot = path.join(process.cwd(), "public", "uploads");
const watermarkPath = path.join(process.cwd(), "public", "brand", "watermark-logo.png");
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"] as const;
type AllowedExtension = (typeof allowedExtensions)[number];

const allowedTypes: Record<AllowedExtension, string[]> = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
};

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function extensionFor(fileName: string): AllowedExtension | null {
  const extension = path.extname(fileName).toLowerCase();
  return allowedExtensions.includes(extension as AllowedExtension) ? (extension as AllowedExtension) : null;
}

function sanitizeFolder(value: FormDataEntryValue | null) {
  const folder = String(value || "general")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return folder || "general";
}

function hasValidMagicBytes(bytes: Uint8Array, extension: AllowedExtension) {
  if (extension === ".jpg" || extension === ".jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (extension === ".png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

async function createWatermarkedImage(bytes: Uint8Array) {
  const base = sharp(bytes, { failOn: "error", limitInputPixels: 32_000_000 }).rotate();
  const metadata = await base.metadata();
  const width = metadata.width || 1200;
  const height = metadata.height || 900;
  const outputWidth = Math.min(width, 1800);
  const watermarkWidth = Math.max(120, Math.min(360, Math.round(outputWidth * 0.22)));

  const { data: watermarkPng, info } = await sharp(watermarkPath)
    .resize({ width: watermarkWidth, withoutEnlargement: true })
    .ensureAlpha()
    .png()
    .toBuffer({ resolveWithObject: true });

  const watermarkSvg = Buffer.from(
    `<svg width="${info.width}" height="${info.height}" viewBox="0 0 ${info.width} ${info.height}" xmlns="http://www.w3.org/2000/svg"><image href="data:image/png;base64,${watermarkPng.toString("base64")}" width="${info.width}" height="${info.height}" opacity="0.42"/></svg>`
  );

  const padding = Math.max(18, Math.round(Math.min(width, height) * 0.035));

  const full = await base
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .composite([{ input: watermarkSvg, gravity: "southeast", left: padding, top: padding }])
    .webp({ quality: 82, effort: 5 })
    .toBuffer();

  const thumb = await sharp(full)
    .resize({ width: 520, height: 390, fit: "cover", position: "attention", withoutEnlargement: true })
    .webp({ quality: 76, effort: 4 })
    .toBuffer();

  return { full, thumb };
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return jsonError("Request must be multipart/form-data.", 415);
    }

    const formData = await request.formData();
    const uploaded = formData.get("file") || formData.get("coverImage") || formData.get("image");

    if (!(uploaded instanceof File)) {
      return jsonError("Image file is required.", 400);
    }

    const extension = extensionFor(uploaded.name);
    if (!extension) {
      return jsonError("Only JPG, JPEG, PNG, and WEBP images are allowed.", 400);
    }

    if (!allowedTypes[extension].includes(uploaded.type)) {
      return jsonError("Uploaded file MIME type is not allowed.", 400);
    }

    if (uploaded.size <= 0) {
      return jsonError("Uploaded file is empty.", 400);
    }

    if (uploaded.size > maxUploadBytes) {
      return jsonError("Image size must not exceed 5MB.", 413);
    }

    const bytes = new Uint8Array(await uploaded.arrayBuffer());
    if (!hasValidMagicBytes(bytes, extension)) {
      return jsonError("Uploaded file content does not match the image type.", 400);
    }

    const folder = sanitizeFolder(formData.get("folder"));
    const uploadDir = path.join(uploadsRoot, folder);
    const resolvedDir = path.resolve(uploadDir);
    const resolvedRoot = path.resolve(uploadsRoot);

    if (!resolvedDir.startsWith(resolvedRoot)) {
      return jsonError("Invalid upload folder.", 400);
    }

    await mkdir(resolvedDir, { recursive: true });

    const baseName = randomUUID();
    const fileName = `${baseName}.webp`;
    const thumbFileName = `${baseName}-thumb.webp`;
    const absolutePath = path.join(resolvedDir, fileName);
    const thumbsDir = path.join(resolvedDir, "thumbs");
    const absoluteThumbPath = path.join(thumbsDir, thumbFileName);
    const publicUrl = `/uploads/${folder}/${fileName}`;
    const thumbnailUrl = `/uploads/${folder}/thumbs/${thumbFileName}`;

    await mkdir(thumbsDir, { recursive: true });

    const processed = await createWatermarkedImage(bytes);
    await writeFile(absolutePath, processed.full, { flag: "wx" });
    await writeFile(absoluteThumbPath, processed.thumb, { flag: "wx" });

    try {
      if (process.env.DATABASE_URL) {
        const db = getHeadlessDb();
        await db.insert(media).values({
          url: publicUrl,
          fileName,
          mimeType: "image/webp",
          size: processed.full.byteLength,
        });
      }
    } catch {
      // Upload should not fail if the optional PostgreSQL CMS layer is not configured yet.
    }

    return Response.json({
      url: publicUrl,
      thumbnailUrl,
      fileName,
      size: processed.full.byteLength,
      mimeType: "image/webp",
      watermarked: true,
    });
  } catch (error) {
    if (error instanceof Error && /operation not permitted|not implemented|unsupported/i.test(error.message)) {
      return jsonError("Local disk uploads require the Node.js runtime on the VPS.", 500);
    }

    return jsonError(error instanceof Error ? error.message : "Unexpected upload error.", 500);
  }
}
