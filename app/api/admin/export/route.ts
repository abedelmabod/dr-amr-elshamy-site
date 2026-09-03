import { getDb, isAdmin, readSettings } from "../../_lib";

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const [articles, reviews, gallery, services, bookings, media, settings] = await Promise.all([
      db.prepare("SELECT * FROM articles ORDER BY id DESC").all(),
      db.prepare("SELECT * FROM reviews ORDER BY id DESC").all(),
      db.prepare("SELECT * FROM gallery_items ORDER BY id DESC").all(),
      db.prepare("SELECT * FROM service_items ORDER BY sort_order ASC, id ASC").all(),
      db.prepare("SELECT * FROM bookings ORDER BY id DESC").all(),
      db.prepare("SELECT * FROM media_items ORDER BY id DESC").all(),
      readSettings(db),
    ]);

    const payload = {
      exportedAt: new Date().toISOString(),
      articles: articles.results || [],
      reviews: reviews.results || [],
      gallery: gallery.results || [],
      services: services.results || [],
      bookings: bookings.results || [],
      media: media.results || [],
      settings,
    };

    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="dr-amr-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
