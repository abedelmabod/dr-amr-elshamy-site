import { getDb } from "../_lib";

const visitorCookieName = "visitor_tracked_day";
const oneDaySeconds = 60 * 60 * 24;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function trackingCookie(value: string, request: Request) {
  const isLocal = new URL(request.url).hostname === "localhost";
  const secure = isLocal ? "" : "; Secure";
  return `${visitorCookieName}=${encodeURIComponent(value)}; Path=/; Max-Age=${oneDaySeconds}; SameSite=Lax${secure}`;
}

export async function POST(request: Request) {
  try {
    const today = todayKey();
    if (cookieValue(request, visitorCookieName) === today) {
      return Response.json({ counted: false });
    }

    const db = await getDb();
    const now = new Date().toISOString();
    await db.prepare("INSERT OR IGNORE INTO stats (key, value, updated_at) VALUES (?, ?, ?)")
      .bind("total_visitors", 0, now)
      .run();
    await db.prepare("UPDATE stats SET value = value + 1, updated_at = ? WHERE key = ?")
      .bind(now, "total_visitors")
      .run();

    return Response.json(
      { counted: true },
      {
        headers: {
          "Set-Cookie": trackingCookie(today, request),
        },
      }
    );
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected tracking error" }, { status: 500 });
  }
}
