import { getDb, isAdmin } from "../../_lib";

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDb();
    const rows = await db.prepare("SELECT key, value, updated_at FROM stats ORDER BY value DESC LIMIT 80").all();
    return Response.json({ items: rows.results || [] });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
