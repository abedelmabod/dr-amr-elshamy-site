import { getDb, isAdmin, logActivity, parseJsonSetting, readSettings } from "../../_lib";

const allowedGroups = new Set(["siteText", "heroConfig", "headerFooterConfig", "builderConfig", "layoutConfig", "themeConfig"]);

function sanitizeKey(value: unknown) {
  return String(value || "").trim().replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 120);
}

function sanitizeValue(value: unknown, type: string) {
  if (Array.isArray(value)) return value.map((item) => sanitizeKey(item)).filter(Boolean).slice(0, 50);
  const limit = type === "image" ? 500 : 2500;
  return String(value ?? "").trim().slice(0, limit);
}

function setPath(target: Record<string, unknown>, path: string[], value: unknown) {
  let current: Record<string, unknown> = target;
  for (const segment of path.slice(0, -1)) {
    const existing = current[segment];
    if (!existing || typeof existing !== "object" || Array.isArray(existing)) current[segment] = {};
    current = current[segment] as Record<string, unknown>;
  }
  current[path[path.length - 1]] = value;
}

export async function PUT(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json() as { group?: string; key?: string; value?: unknown; type?: string };
    const group = sanitizeKey(payload.group);
    const key = sanitizeKey(payload.key);
    if (!allowedGroups.has(group) || !key) {
      return Response.json({ error: "Invalid editable target." }, { status: 400 });
    }

    const db = await getDb();
    const settings = await readSettings(db);
    const current = parseJsonSetting<Record<string, unknown>>((settings as Record<string, string>)[group], {});
    setPath(current, key.split(".").filter(Boolean), sanitizeValue(payload.value, payload.type || "text"));

    const now = new Date().toISOString();
    await db.prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
    )
      .bind(group, JSON.stringify(current), now)
      .run();
    await logActivity(db, "live_edit", group, key, { type: payload.type || "text" });

    return Response.json({ ok: true, group, key, value: payload.value });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
