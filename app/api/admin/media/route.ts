import { getDb, isAdmin, logActivity, normalizeMedia, pageParams } from "../../_lib";

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || "all";
    const search = `%${String(url.searchParams.get("search") || "").trim().replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
    const { page, pageSize, offset } = pageParams(request);
    const categoryClause = category === "all" ? "" : "AND category = ?";
    const params = category === "all" ? [search, search] : [search, search, category];
    const total = await db.prepare(`SELECT COUNT(*) as count FROM media_items WHERE (url LIKE ? ESCAPE '\\' OR alt LIKE ? ESCAPE '\\') ${categoryClause}`)
      .bind(...params)
      .first<{ count: number }>();
    const rows = await db.prepare(
      `SELECT id, url, alt, category, created_at
       FROM media_items
       WHERE (url LIKE ? ESCAPE '\\' OR alt LIKE ? ESCAPE '\\') ${categoryClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`
    )
      .bind(...params, pageSize, offset)
      .all();

    return Response.json({ items: rows.results || [], total: total?.count || 0, page, pageSize });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const media = normalizeMedia(await request.json());
    if (!media.url) return Response.json({ error: "Media URL is required." }, { status: 400 });

    const db = await getDb();
    await db.prepare("INSERT OR IGNORE INTO media_items (url, alt, category, created_at) VALUES (?, ?, ?, ?)")
      .bind(media.url, media.alt, media.category, new Date().toISOString())
      .run();
    await logActivity(db, "created", "media", media.url, { category: media.category });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json() as { id?: number };
    const id = Number(payload.id);
    const media = normalizeMedia(payload);
    if (!id) return Response.json({ error: "Media id is required." }, { status: 400 });

    const db = await getDb();
    await db.prepare("UPDATE media_items SET alt = ?, category = ? WHERE id = ?")
      .bind(media.alt, media.category, id)
      .run();
    await logActivity(db, "updated", "media", id, { category: media.category });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!id) return Response.json({ error: "Media id is required." }, { status: 400 });
    const db = await getDb();
    await db.prepare("DELETE FROM media_items WHERE id = ?").bind(id).run();
    await logActivity(db, "deleted", "media", id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
