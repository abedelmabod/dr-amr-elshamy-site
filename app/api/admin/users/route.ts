import { getDb, hashAdminPassword, isAdmin, logActivity, normalizeUser, pageParams } from "../../_lib";

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDb();
    const { page, pageSize, offset } = pageParams(request);
    const total = await db.prepare("SELECT COUNT(*) as count FROM admin_users").first<{ count: number }>();
    const rows = await db.prepare("SELECT id, username, role, permissions, status, created_at, updated_at FROM admin_users ORDER BY id DESC LIMIT ? OFFSET ?")
      .bind(pageSize, offset).all();
    return Response.json({ items: rows.results || [], total: total?.count || 0, page, pageSize });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const user = normalizeUser(await request.json());
    if (!user.username || user.password.length < 10) return Response.json({ error: "Username and a 10+ character password are required." }, { status: 400 });
    const db = await getDb();
    const now = new Date().toISOString();
    await db.prepare("INSERT INTO admin_users (username, password_hash, role, permissions, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(user.username, await hashAdminPassword(user.password), user.role, user.permissions, user.status, now, now).run();
    await logActivity(db, "created", "admin_user", user.username, { role: user.role });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = await request.json() as { id?: number };
    const id = Number(payload.id);
    const user = normalizeUser(payload);
    if (!id || !user.username) return Response.json({ error: "User id and username are required." }, { status: 400 });
    const db = await getDb();
    if (user.password) {
      await db.prepare("UPDATE admin_users SET username = ?, password_hash = ?, role = ?, permissions = ?, status = ?, updated_at = ? WHERE id = ?")
        .bind(user.username, await hashAdminPassword(user.password), user.role, user.permissions, user.status, new Date().toISOString(), id).run();
    } else {
      await db.prepare("UPDATE admin_users SET username = ?, role = ?, permissions = ?, status = ?, updated_at = ? WHERE id = ?")
        .bind(user.username, user.role, user.permissions, user.status, new Date().toISOString(), id).run();
    }
    await logActivity(db, "updated", "admin_user", id, { role: user.role });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
