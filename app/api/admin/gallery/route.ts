import { getDb, isAdmin, logActivity, normalizeGallery, pageParams } from "../../_lib";

type GalleryRow = {
  id: number;
  title: string;
  category: string;
  image: string;
  before_image?: string | null;
  after_image?: string | null;
  duration?: string | null;
  featured?: number | null;
  status: string;
  created_at?: string;
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
    const search = `%${String(url.searchParams.get("search") || "").trim().replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
    const { page, pageSize, offset } = pageParams(request);
    const statusClause = status === "published" || status === "draft" ? "AND status = ?" : "";
    const params = statusClause ? [search, status] : [search];

    const total = await db.prepare(`SELECT COUNT(*) as count FROM gallery_items WHERE title LIKE ? ESCAPE '\\' ${statusClause}`)
      .bind(...params)
      .first<{ count: number }>();
    const rows = await db.prepare(
      `SELECT id, title, category, image, before_image, after_image, duration, featured, status, created_at, updated_at, publish_at
       FROM gallery_items
       WHERE title LIKE ? ESCAPE '\\' ${statusClause}
       ORDER BY featured DESC, id DESC
       LIMIT ? OFFSET ?`
    )
      .bind(...params, pageSize, offset)
      .all<GalleryRow>();

    return Response.json({ items: rows.results || [], total: total?.count || 0, page, pageSize });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const item = normalizeGallery(await request.json());
    if (!item.title || !item.beforeImage || !item.afterImage) {
      return Response.json({ error: "Case title, before image, and after image are required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const db = await getDb();
    await db.prepare(
      "INSERT INTO gallery_items (title, category, image, before_image, after_image, duration, featured, status, publish_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(item.title, item.category, item.afterImage, item.beforeImage, item.afterImage, item.duration, item.featured, item.status, item.publishAt, now, now)
      .run();
    await logActivity(db, "created", "case", item.title);

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
    const item = normalizeGallery(payload);
    if (!id || !item.title || !item.beforeImage || !item.afterImage) {
      return Response.json({ error: "Case id, title, before image, and after image are required." }, { status: 400 });
    }

    const db = await getDb();
    await db.prepare(
      "UPDATE gallery_items SET title = ?, category = ?, image = ?, before_image = ?, after_image = ?, duration = ?, featured = ?, status = ?, publish_at = ?, updated_at = ? WHERE id = ?"
    )
      .bind(item.title, item.category, item.afterImage, item.beforeImage, item.afterImage, item.duration, item.featured, item.status, item.publishAt, new Date().toISOString(), id)
      .run();
    await logActivity(db, "updated", "case", id, { title: item.title });

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
    if (!id) return Response.json({ error: "Case id is required." }, { status: 400 });

    const db = await getDb();
    await db.prepare("DELETE FROM gallery_items WHERE id = ?").bind(id).run();
    await logActivity(db, "deleted", "case", id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
