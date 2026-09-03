import { isAdmin } from "../app/api/_lib";

export async function requireAdminSession(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export function sanitizeText(value: unknown, maxLength = 5000) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeSlug(value: unknown) {
  return sanitizeText(value, 140)
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
