import { getDb, isAdmin, normalizeArticle, normalizeGallery, normalizeReview, uniqueArticleSlug } from "../../_lib";

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const [reviews, articles, gallery] = await Promise.all([
    db.prepare("SELECT * FROM reviews ORDER BY id DESC").all(),
    db.prepare("SELECT * FROM articles ORDER BY id DESC").all(),
    db.prepare("SELECT * FROM gallery_items ORDER BY id DESC").all(),
  ]);

  return Response.json({
    reviews: reviews.results || [],
    articles: articles.results || [],
    gallery: gallery.results || [],
  });
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const payload = (await request.json()) as { type?: string; action?: string; id?: number; data?: unknown };

  if (payload.type === "review" && payload.action === "status") {
    const review = normalizeReview(payload.data || {});
    await db.prepare("UPDATE reviews SET status = ? WHERE id = ?").bind(review.status, payload.id).run();
    return Response.json({ ok: true });
  }

  if (payload.type === "review" && payload.action === "delete") {
    await db.prepare("DELETE FROM reviews WHERE id = ?").bind(payload.id).run();
    return Response.json({ ok: true });
  }

  if (payload.type === "article" && payload.action === "create") {
    const article = normalizeArticle(payload.data || {});
    if (!article.title || !article.body) {
      return Response.json({ error: "Article fields are required." }, { status: 400 });
    }
    const slug = await uniqueArticleSlug(db, article.slug || article.title);
    await db
      .prepare("INSERT INTO articles (title, slug, meta_description, cover_image, body, conclusion, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(article.title, slug, article.metaDescription, article.coverImage, article.body, article.conclusion, article.status, new Date().toISOString(), new Date().toISOString())
      .run();
    return Response.json({ ok: true });
  }

  if (payload.type === "gallery" && payload.action === "create") {
    const item = normalizeGallery(payload.data || {});
    if (!item.title || !item.beforeImage || !item.afterImage) {
      return Response.json({ error: "Gallery title, before image, and after image are required." }, { status: 400 });
    }
    await db
      .prepare("INSERT INTO gallery_items (title, category, image, before_image, after_image, duration, featured, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(item.title, item.category, item.afterImage, item.beforeImage, item.afterImage, item.duration, item.featured, item.status, new Date().toISOString(), new Date().toISOString())
      .run();
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Unsupported action." }, { status: 400 });
}
