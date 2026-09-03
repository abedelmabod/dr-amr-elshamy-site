import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";
import { getDb, isAdmin } from "../../_lib";

export const runtime = "nodejs";

type ReadinessCheck = {
  key: string;
  label: string;
  ok: boolean;
  hint: string;
};

function envValue(key: string) {
  return process.env[key] || "";
}

async function canWriteDirectory(directory: string) {
  try {
    await mkdir(directory, { recursive: true });
    await access(directory, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const checks: ReadinessCheck[] = [];
  const authSecret = envValue("ADMIN_AUTH_SECRET") || envValue("JWT_SECRET");
  const passwordHash = envValue("ADMIN_PASSWORD_HASH");
  const siteUrl = envValue("NEXT_PUBLIC_SITE_URL");

  checks.push({
    key: "auth-secret",
    label: "Admin session secret",
    ok: authSecret.length >= 32 && !authSecret.includes("local-dev") && !authSecret.includes("replace"),
    hint: "Use a long random production ADMIN_AUTH_SECRET.",
  });

  checks.push({
    key: "password-hash",
    label: "Admin password hash",
    ok: passwordHash.startsWith("sha256:") && !passwordHash.includes("replace"),
    hint: "Set ADMIN_PASSWORD_HASH to a real hash before production.",
  });

  checks.push({
    key: "site-url",
    label: "Public site URL",
    ok: /^https:\/\/[^/]+\.[^/]+/.test(siteUrl),
    hint: "Set NEXT_PUBLIC_SITE_URL to the real HTTPS domain.",
  });

  try {
    const db = await getDb();
    await db.prepare("SELECT COUNT(*) as count FROM settings").first();
    checks.push({ key: "database", label: "Database", ok: true, hint: "Database is reachable." });
  } catch {
    checks.push({ key: "database", label: "Database", ok: false, hint: "Database path or permissions need attention." });
  }

  checks.push({
    key: "uploads",
    label: "Uploads folder",
    ok: await canWriteDirectory(path.join(process.cwd(), "public", "uploads")),
    hint: "public/uploads must be writable and backed up.",
  });

  try {
    await access(path.join(process.cwd(), "public", "brand", "watermark-logo.png"), constants.R_OK);
    checks.push({ key: "watermark", label: "Watermark logo", ok: true, hint: "Watermark file is available." });
  } catch {
    checks.push({ key: "watermark", label: "Watermark logo", ok: false, hint: "Add public/brand/watermark-logo.png." });
  }

  return Response.json({
    ok: checks.every((check) => check.ok),
    checks,
    generatedAt: new Date().toISOString(),
  });
}
