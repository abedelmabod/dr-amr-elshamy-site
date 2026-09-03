import { getDb, isAdmin, logActivity, normalizeBooking, pageParams } from "../../_lib";

type BookingStatus = "new" | "contacted" | "closed";

function normalizeStatus(value: unknown): BookingStatus | "all" {
  return value === "new" || value === "contacted" || value === "closed" ? value : "all";
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const status = normalizeStatus(new URL(request.url).searchParams.get("status"));
    const { page, pageSize, offset } = pageParams(request);
    const statusClause = status === "all" ? "" : "WHERE status = ?";
    const params = status === "all" ? [] : [status];
    const total = await db.prepare(`SELECT COUNT(*) as count FROM bookings ${statusClause}`).bind(...params).first<{ count: number }>();
    const rows = await db.prepare(
      `SELECT id, name, phone, service, message, preferred_date, status, created_at, updated_at
       FROM bookings
       ${statusClause}
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

export async function PATCH(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json() as { id?: number; status?: BookingStatus };
    const id = Number(payload.id);
    const booking = normalizeBooking(payload);
    if (!id || !["new", "contacted", "closed"].includes(booking.status)) {
      return Response.json({ error: "Booking id and valid status are required." }, { status: 400 });
    }

    const db = await getDb();
    await db.prepare("UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?")
      .bind(booking.status, new Date().toISOString(), id)
      .run();
    await logActivity(db, "status_changed", "booking", id, { status: booking.status });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
