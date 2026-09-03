import { getDb, isAdmin, logActivity, normalizeSettings, readSettings } from "../../_lib";

const contactSettingKeys = new Set([
  "phonePrimary",
  "phoneSecondary",
  "whatsappPhone",
  "facebookUrl",
  "instagramUrl",
  "tiktokUrl",
  "mapUrl",
  "email",
]);

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    return Response.json(await readSettings(db));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = normalizeSettings(await request.json());
    const db = await getDb();
    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(settings)) {
      if (!contactSettingKeys.has(key)) continue;
      await db.prepare(
        "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
      )
        .bind(key, value, now)
        .run();
    }
    await logActivity(db, "updated", "settings");

    return Response.json({ ok: true, settings });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
