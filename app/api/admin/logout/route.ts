import { clearAdminCookie } from "../../_lib";

export async function POST(request: Request) {
  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": clearAdminCookie(request),
      },
    }
  );
}
