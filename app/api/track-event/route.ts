import { getDb } from "../_lib";

const allowedEvents = new Set([
  "page_view",
  "whatsapp_click",
  "phone_click",
  "map_click",
  "service_click",
  "article_share",
  "review_submit",
  "booking_submit",
]);

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({})) as { event?: string; label?: string };
    const event = allowedEvents.has(String(payload.event)) ? String(payload.event) : "service_click";
    const label = String(payload.label || "general").replace(/[^a-zA-Z0-9_\-/. ]/g, "").slice(0, 80) || "general";
    const key = `event:${event}:${label}`;
    const db = await getDb();
    await db.prepare("INSERT INTO stats (key, value, updated_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET value = value + 1, updated_at = excluded.updated_at")
      .bind(key, new Date().toISOString()).run();
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
