import { getAdminSession } from "../../_lib";

export async function GET(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return Response.json({ authenticated: false }, { status: 401 });

  return Response.json({
    authenticated: true,
    username: session.username,
    role: session.role,
    permissions: session.permissions,
    isSuperAdmin: ["admin", "owner", "super-admin", "super_admin"].includes(session.role) || session.permissions.includes("all"),
  });
}
