import { getDb, isAdmin } from "../../_lib";

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const [visitors, articles, pendingReviews, draftArticles, newBookings, activity] = await Promise.all([
      db.prepare("SELECT value FROM stats WHERE key = ?").bind("total_visitors").first<{ value: number }>(),
      db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = ?").bind("published").first<{ count: number }>(),
      db.prepare("SELECT COUNT(*) as count FROM reviews WHERE status = ?").bind("pending").first<{ count: number }>(),
      db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = ?").bind("draft").first<{ count: number }>(),
      db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = ?").bind("new").first<{ count: number }>(),
      db.prepare("SELECT action, entity, entity_id, created_at FROM activity_logs ORDER BY id DESC LIMIT 5").all(),
    ]);

    return Response.json({
      totalVisitors: visitors?.value || 0,
      publishedArticles: articles?.count || 0,
      pendingReviews: pendingReviews?.count || 0,
      draftArticles: draftArticles?.count || 0,
      newBookings: newBookings?.count || 0,
      alerts: [
        pendingReviews?.count ? `${pendingReviews.count} pending reviews need approval` : "",
        draftArticles?.count ? `${draftArticles.count} draft articles are waiting` : "",
        newBookings?.count ? `${newBookings.count} new booking requests` : "",
      ].filter(Boolean),
      activity: activity.results || [],
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
