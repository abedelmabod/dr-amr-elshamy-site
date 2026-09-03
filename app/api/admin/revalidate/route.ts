import { revalidatePath } from "next/cache";
import { requireAdminSession, sanitizeText } from "../../../../lib/admin-session";

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession(request);
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const path = sanitizeText(payload.path, 200);

    if (!path || !path.startsWith("/")) {
      return Response.json({ error: "A valid absolute path is required." }, { status: 400 });
    }

    revalidatePath(path);
    return Response.json({ ok: true, path });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error." }, { status: 500 });
  }
}
