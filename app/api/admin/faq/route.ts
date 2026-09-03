import { getDb, isAdmin, logActivity, normalizeFaq, pageParams } from "../../_lib";

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const pageFilter = url.searchParams.get("pageFilter") || "all";
    const status = url.searchParams.get("status") || "all";
    const { page, pageSize, offset } = pageParams(request);
    const clauses = [];
    const params: unknown[] = [];
    if (pageFilter !== "all") {
      clauses.push("page = ?");
      params.push(pageFilter);
    }
    if (status === "published" || status === "draft") {
      clauses.push("status = ?");
      params.push(status);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const total = await db.prepare(`SELECT COUNT(*) as count FROM faq_items ${where}`).bind(...params).first<{ count: number }>();
    const rows = await db.prepare(
      `SELECT id, question_ar, question_en, answer_ar, answer_en, page, sort_order, status, created_at, updated_at
       FROM faq_items ${where}
       ORDER BY sort_order ASC, id DESC LIMIT ? OFFSET ?`
    ).bind(...params, pageSize, offset).all();
    return Response.json({ items: rows.results || [], total: total?.count || 0, page, pageSize });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const faq = normalizeFaq(await request.json());
    if (!faq.questionAr || !faq.questionEn || !faq.answerAr || !faq.answerEn) {
      return Response.json({ error: "FAQ questions and answers are required." }, { status: 400 });
    }
    const db = await getDb();
    const now = new Date().toISOString();
    await db.prepare("INSERT INTO faq_items (question_ar, question_en, answer_ar, answer_en, page, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(faq.questionAr, faq.questionEn, faq.answerAr, faq.answerEn, faq.page, faq.sortOrder, faq.status, now, now).run();
    await logActivity(db, "created", "faq", faq.questionEn);
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
    const faq = normalizeFaq(payload);
    if (!id) return Response.json({ error: "FAQ id is required." }, { status: 400 });
    const db = await getDb();
    await db.prepare("UPDATE faq_items SET question_ar = ?, question_en = ?, answer_ar = ?, answer_en = ?, page = ?, sort_order = ?, status = ?, updated_at = ? WHERE id = ?")
      .bind(faq.questionAr, faq.questionEn, faq.answerAr, faq.answerEn, faq.page, faq.sortOrder, faq.status, new Date().toISOString(), id).run();
    await logActivity(db, "updated", "faq", id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!id) return Response.json({ error: "FAQ id is required." }, { status: 400 });
    const db = await getDb();
    await db.prepare("DELETE FROM faq_items WHERE id = ?").bind(id).run();
    await logActivity(db, "deleted", "faq", id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
