import { getDb, isAdmin, logActivity } from "../../_lib";

export async function POST(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = await request.json() as Record<string, unknown>;
    const db = await getDb();
    const now = new Date().toISOString();
    const settings = payload.settings && typeof payload.settings === "object" ? payload.settings as Record<string, unknown> : {};
    for (const [key, value] of Object.entries(settings)) {
      if (typeof value !== "string") continue;
      await db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
        .bind(key, value, now).run();
    }
    await logActivity(db, "imported", "backup", "", { settings: Object.keys(settings).length });
    return Response.json({ ok: true, importedSettings: Object.keys(settings).length });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected import error" }, { status: 500 });
  }
}
