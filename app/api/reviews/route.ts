import { getDb, normalizeReview } from "../_lib";

export async function POST(request: Request) {
  try {
    const payload = normalizeReview(await request.json());

    if (!payload.name || !payload.message) {
      return Response.json({ error: "Name and review are required." }, { status: 400 });
    }

    const db = await getDb();
    await db
      .prepare("INSERT INTO reviews (name, rating, message, status, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(payload.name, payload.rating, payload.message, "pending", new Date().toISOString())
      .run();

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
