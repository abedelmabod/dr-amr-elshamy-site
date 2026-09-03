import { adminUsername, getDb, hashAdminPassword, isAdmin, logActivity, verifyAdminCredentials } from "../../_lib";

export async function PUT(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json() as { currentPassword?: string; newPassword?: string };
    const currentPassword = String(payload.currentPassword || "");
    const newPassword = String(payload.newPassword || "");
    if (newPassword.length < 10) {
      return Response.json({ error: "New password must be at least 10 characters." }, { status: 400 });
    }

    if (!(await verifyAdminCredentials(adminUsername(), currentPassword))) {
      return Response.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    const db = await getDb();
    const hash = await hashAdminPassword(newPassword);
    await db.prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
    )
      .bind("adminPasswordHash", hash, new Date().toISOString())
      .run();
    await logActivity(db, "changed_password", "admin");
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
