import { getDb, isAdmin, logActivity, normalizeService, pageParams } from "../../_lib";

type ServiceRow = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_ar: string;
  description_en: string;
  whatsapp_message_ar?: string | null;
  whatsapp_message_en?: string | null;
  icon: string;
  sort_order: number;
  featured: number;
  status: string;
  created_at?: string;
  updated_at?: string | null;
};

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const search = `%${String(url.searchParams.get("search") || "").trim().replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
    const { page, pageSize, offset } = pageParams(request);
    const statusClause = status === "published" || status === "draft" ? "AND status = ?" : "";
    const params = statusClause ? [search, search, status] : [search, search];

    const total = await db.prepare(`SELECT COUNT(*) as count FROM service_items WHERE (title_en LIKE ? ESCAPE '\\' OR title_ar LIKE ? ESCAPE '\\') ${statusClause}`)
      .bind(...params)
      .first<{ count: number }>();
    const rows = await db.prepare(
      `SELECT id, slug, title_en, title_ar, description_ar, description_en, whatsapp_message_ar, whatsapp_message_en, icon, sort_order, featured, status, created_at, updated_at
       FROM service_items
       WHERE (title_en LIKE ? ESCAPE '\\' OR title_ar LIKE ? ESCAPE '\\') ${statusClause}
       ORDER BY sort_order ASC, id ASC
       LIMIT ? OFFSET ?`
    )
      .bind(...params, pageSize, offset)
      .all<ServiceRow>();

    return Response.json({ items: rows.results || [], total: total?.count || 0, page, pageSize });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const item = normalizeService(await request.json());
    if (!item.slug || !item.titleEn || !item.titleAr) {
      return Response.json({ error: "Service slug, Arabic title, and English title are required." }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date().toISOString();
    await db.prepare(
      "INSERT INTO service_items (slug, title_en, title_ar, description_ar, description_en, whatsapp_message_ar, whatsapp_message_en, icon, sort_order, featured, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(item.slug, item.titleEn, item.titleAr, item.descriptionAr, item.descriptionEn, item.whatsappMessageAr, item.whatsappMessageEn, item.icon, item.sortOrder, item.featured, item.status, now, now)
      .run();
    await logActivity(db, "created", "service", item.slug, { title: item.titleEn });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = (await request.json()) as { id?: number };
    const id = Number(payload.id);
    const item = normalizeService(payload);
    if (!id || !item.slug || !item.titleEn || !item.titleAr) {
      return Response.json({ error: "Service id, slug, Arabic title, and English title are required." }, { status: 400 });
    }

    const db = await getDb();
    await db.prepare(
      "UPDATE service_items SET slug = ?, title_en = ?, title_ar = ?, description_ar = ?, description_en = ?, whatsapp_message_ar = ?, whatsapp_message_en = ?, icon = ?, sort_order = ?, featured = ?, status = ?, updated_at = ? WHERE id = ?"
    )
      .bind(item.slug, item.titleEn, item.titleAr, item.descriptionAr, item.descriptionEn, item.whatsappMessageAr, item.whatsappMessageEn, item.icon, item.sortOrder, item.featured, item.status, new Date().toISOString(), id)
      .run();
    await logActivity(db, "updated", "service", id, { title: item.titleEn });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!id) return Response.json({ error: "Service id is required." }, { status: 400 });
    const db = await getDb();
    await db.prepare("DELETE FROM service_items WHERE id = ?").bind(id).run();
    await logActivity(db, "deleted", "service", id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
