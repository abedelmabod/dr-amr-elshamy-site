import { getDb } from "../../_lib";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = await getDb();
    const article = await db.prepare(
      "SELECT id, title, slug, meta_description, excerpt_ar, excerpt_en, cover_image, body, conclusion, category, author, featured, faq_items, status, created_at, updated_at, publish_at FROM articles WHERE slug = ? AND status = ? AND (publish_at IS NULL OR publish_at = '' OR publish_at <= ?) LIMIT 1"
    )
      .bind(slug, "published", new Date().toISOString())
      .first();

    if (!article) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    return Response.json(article);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
