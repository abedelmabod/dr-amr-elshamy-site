import { getDb, isAdmin, pageParams } from "../../_lib";

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const { page, pageSize, offset } = pageParams(request);
    const total = await db.prepare("SELECT COUNT(*) as count FROM activity_logs").first<{ count: number }>();
    const rows = await db.prepare(
      "SELECT id, actor, action, entity, entity_id, details, created_at FROM activity_logs ORDER BY id DESC LIMIT ? OFFSET ?"
    )
      .bind(pageSize, offset)
      .all();

    return Response.json({ items: rows.results || [], total: total?.count || 0, page, pageSize });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
