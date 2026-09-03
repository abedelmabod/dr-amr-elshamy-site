import { getDb, isAdmin, likeQuery, logActivity, normalizeArticle, pageParams, uniqueArticleSlug } from "../../_lib";

type ArticleRow = {
  id: number;
  title: string;
  slug: string;
  meta_description?: string | null;
  cover_image?: string | null;
  body: string;
  conclusion: string;
  status: string;
  created_at: string;
  updated_at?: string | null;
  publish_at?: string | null;
};

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const search = likeQuery(url.searchParams.get("search"));
    const { page, pageSize, offset } = pageParams(request);

    const statusClause = status === "published" || status === "draft" ? "AND status = ?" : "";
    const params = statusClause ? [search, status] : [search];
    const countParams = [...params];

    const total = await db
      .prepare(`SELECT COUNT(*) as count FROM articles WHERE title LIKE ? ESCAPE '\\' ${statusClause}`)
      .bind(...countParams)
      .first<{ count: number }>();
    const rows = await db
      .prepare(
        `SELECT id, title, slug, meta_description, cover_image, body, conclusion, status, created_at, updated_at, publish_at
         FROM articles
         WHERE title LIKE ? ESCAPE '\\' ${statusClause}
         ORDER BY id DESC
         LIMIT ? OFFSET ?`
      )
      .bind(...params, pageSize, offset)
      .all<ArticleRow>();

    return Response.json({
      items: rows.results || [],
      total: total?.count || 0,
      page,
      pageSize,
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const article = normalizeArticle(await request.json());
    if (!article.title || !article.body) {
      return Response.json({ error: "Article title and content are required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const db = await getDb();
    const slug = await uniqueArticleSlug(db, article.slug || article.title);
    await db
      .prepare("INSERT INTO articles (title, slug, meta_description, cover_image, body, conclusion, status, publish_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(article.title, slug, article.metaDescription, article.coverImage, article.body, article.conclusion, article.status, article.publishAt, now, now)
      .run();
    await logActivity(db, "created", "article", slug, { title: article.title });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as { id?: number };
    const id = Number(payload.id);
    const article = normalizeArticle(payload);
    if (!id || !article.title || !article.body) {
      return Response.json({ error: "Article id, title, and content are required." }, { status: 400 });
    }

    const db = await getDb();
    const slug = await uniqueArticleSlug(db, article.slug || article.title, id);
    await db
      .prepare("UPDATE articles SET title = ?, slug = ?, meta_description = ?, cover_image = ?, body = ?, conclusion = ?, status = ?, publish_at = ?, updated_at = ? WHERE id = ?")
      .bind(article.title, slug, article.metaDescription, article.coverImage, article.body, article.conclusion, article.status, article.publishAt, new Date().toISOString(), id)
      .run();
    await logActivity(db, "updated", "article", id, { title: article.title });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!id) {
      return Response.json({ error: "Article id is required." }, { status: 400 });
    }

    const db = await getDb();
    await db.prepare("DELETE FROM articles WHERE id = ?").bind(id).run();
    await logActivity(db, "deleted", "article", id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
