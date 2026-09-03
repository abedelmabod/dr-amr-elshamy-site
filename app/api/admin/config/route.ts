import { getDb, isAdmin, logActivity, parseJsonSetting, readSettings } from "../../_lib";

function normalizeJson(value: unknown, fallback: unknown) {
  if (typeof value === "string") return JSON.stringify(parseJsonSetting(value, fallback));
  return JSON.stringify(value || fallback);
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const settings = await readSettings(db);
    return Response.json({
      homeConfig: parseJsonSetting(settings.homeConfig, { serviceIds: [], articleIds: [], caseIds: [], reviewIds: [] }),
      siteText: parseJsonSetting(settings.siteText, {}),
      heroConfig: parseJsonSetting(settings.heroConfig, {}),
      themeConfig: parseJsonSetting(settings.themeConfig, {}),
      layoutConfig: parseJsonSetting(settings.layoutConfig, {}),
      headerFooterConfig: parseJsonSetting(settings.headerFooterConfig, {}),
      bannerConfig: parseJsonSetting(settings.bannerConfig, {}),
      formConfig: parseJsonSetting(settings.formConfig, {}),
      languageOverrides: parseJsonSetting(settings.languageOverrides, {}),
      scriptsConfig: parseJsonSetting(settings.scriptsConfig, {}),
      builderConfig: parseJsonSetting(settings.builderConfig, {}),
      doctorProfile: parseJsonSetting(settings.doctorProfile, {}),
      seoPages: parseJsonSetting(settings.seoPages, {}),
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json() as Record<string, unknown>;
    const updates: Record<string, string> = {};
    for (const key of ["homeConfig", "siteText", "heroConfig", "themeConfig", "layoutConfig", "headerFooterConfig", "bannerConfig", "formConfig", "languageOverrides", "scriptsConfig", "builderConfig", "doctorProfile", "seoPages"]) {
      if (key in payload) updates[key] = normalizeJson(payload[key], key === "homeConfig" ? { serviceIds: [], articleIds: [], caseIds: [], reviewIds: [] } : {});
    }

    const db = await getDb();
    const now = new Date().toISOString();
    for (const [key, value] of Object.entries(updates)) {
      await db.prepare(
        "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
      )
        .bind(key, value, now)
        .run();
      await logActivity(db, "updated", key);
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
