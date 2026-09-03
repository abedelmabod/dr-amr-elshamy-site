import { checkLoginRateLimit, clearAdminCookie, clearLoginRateLimit, createAdminToken, setAdminCookie, verifyAdminCredentials } from "../../_lib";

export async function POST(request: Request) {
  if (!checkLoginRateLimit(request)) {
    return Response.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
  }

  const payload = (await request.json()) as { username?: string; password?: string };
  const username = String(payload.username || "").trim();
  const password = String(payload.password || "");

  if (!(await verifyAdminCredentials(username, password))) {
    return Response.json({ error: "Invalid username or password." }, { status: 401 });
  }

  clearLoginRateLimit(request);
  const token = await createAdminToken(username);
  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": setAdminCookie(token, request),
      },
    }
  );
}

export async function DELETE(request: Request) {
  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": clearAdminCookie(request),
      },
    }
  );
}
