import { getDb, parseJsonSetting, readSettings } from "../_lib";

export async function GET() {
  try {
    const db = await getDb();
    const [reviews, articles, gallery, services, faq, settings] = await Promise.all([
      db.prepare("SELECT * FROM reviews WHERE status IN (?, ?) ORDER BY id DESC LIMIT 12").bind("approved", "published").all(),
      db.prepare("SELECT id, title, slug, meta_description, cover_image, body, conclusion, status, created_at, updated_at FROM articles WHERE status = ? AND (publish_at IS NULL OR publish_at = '' OR publish_at <= ?) ORDER BY id DESC LIMIT 8").bind("published", new Date().toISOString()).all(),
      db.prepare("SELECT id, title, category, image, before_image, after_image, duration, featured, status, created_at, updated_at FROM gallery_items WHERE status = ? AND (publish_at IS NULL OR publish_at = '' OR publish_at <= ?) ORDER BY featured DESC, id DESC LIMIT 12").bind("published", new Date().toISOString()).all(),
      db.prepare("SELECT id, slug, title_en, title_ar, description_ar, description_en, whatsapp_message_ar, whatsapp_message_en, icon, sort_order, featured, status FROM service_items WHERE status = ? ORDER BY sort_order ASC, id ASC").bind("published").all(),
      db.prepare("SELECT id, question_ar, question_en, answer_ar, answer_en, page, sort_order FROM faq_items WHERE status = ? ORDER BY sort_order ASC, id ASC LIMIT 40").bind("published").all(),
      readSettings(db),
    ]);

    return Response.json({
      reviews: reviews.results || [],
      articles: articles.results || [],
      gallery: gallery.results || [],
      services: services.results || [],
      faq: faq.results || [],
      settings,
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
