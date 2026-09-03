import { getDb, normalizeBooking } from "../_lib";

export async function POST(request: Request) {
  try {
    const booking = normalizeBooking(await request.json());
    if (!booking.name) {
      return Response.json({ error: "Patient name is required." }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date().toISOString();
    await db.prepare(
      "INSERT INTO bookings (name, phone, service, message, preferred_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(booking.name, booking.phone, booking.service, booking.message, booking.preferredDate, "new", now, now)
      .run();

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
