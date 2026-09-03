import { getDb, isAdmin, logActivity, pageParams } from "../../_lib";

type ReviewStatus = "pending" | "approved" | "rejected";

type ReviewRow = {
  id: number;
  name: string;
  rating: number;
  message: string;
  status: string;
  created_at: string;
  updated_at?: string | null;
};

function normalizeReviewStatus(value: string | null | undefined): ReviewStatus | "all" {
  if (value === "pending" || value === "approved" || value === "rejected") return value;
  return "all";
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const status = normalizeReviewStatus(new URL(request.url).searchParams.get("status"));
    const { page, pageSize, offset } = pageParams(request);
    const statusClause = status === "all" ? "" : "WHERE status = ?";
    const params = status === "all" ? [] : [status];

    const total = await db
      .prepare(`SELECT COUNT(*) as count FROM reviews ${statusClause}`)
      .bind(...params)
      .first<{ count: number }>();
    const rows = await db
      .prepare(
        `SELECT id, name, rating, message, status, created_at, updated_at
         FROM reviews
         ${statusClause}
         ORDER BY id DESC
         LIMIT ? OFFSET ?`
      )
      .bind(...params, pageSize, offset)
      .all<ReviewRow>();

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

export async function PATCH(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as { id?: number; status?: ReviewStatus };
    const id = Number(payload.id);
    const status = normalizeReviewStatus(payload.status);
    if (!id || status === "all") {
      return Response.json({ error: "Review id and a valid status are required." }, { status: 400 });
    }

    const db = await getDb();
    await db
      .prepare("UPDATE reviews SET status = ?, updated_at = ? WHERE id = ?")
      .bind(status, new Date().toISOString(), id)
      .run();
    await logActivity(db, "moderated", "review", id, { status });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
