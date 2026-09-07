import { getDb } from "../../_lib";

const articleSelect =
  "SELECT id, title, slug, meta_description, excerpt_ar, excerpt_en, cover_image, body, conclusion, category, author, featured, faq_items, status, created_at, updated_at, publish_at FROM articles";

function normalizeSlug(value: string) {
  try {
    return decodeURIComponent(value).normalize("NFC");
  } catch {
    return value.normalize("NFC");
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = await getDb();
    const now = new Date().toISOString();
    const article = await db.prepare(
      `${articleSelect} WHERE slug = ? AND status = ? AND (publish_at IS NULL OR publish_at = '' OR publish_at <= ?) LIMIT 1`
    )
      .bind(slug, "published", now)
      .first();

    if (article) {
      return Response.json(article);
    }

    const normalizedSlug = normalizeSlug(slug);
    const articles = await db.prepare(
      `${articleSelect} WHERE status = ? AND (publish_at IS NULL OR publish_at = '' OR publish_at <= ?) ORDER BY id DESC`
    )
      .bind("published", now)
      .all();
    const fallback = (articles.results || []).find((item) => normalizeSlug(String(item.slug || "")) === normalizedSlug);

    if (!fallback) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    return Response.json(fallback);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
