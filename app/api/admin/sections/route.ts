import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getHeadlessDb } from "../../../../db/headless-db";
import { pageSections } from "../../../../db/headless-schema";
import { requireAdminSession, sanitizeSlug, sanitizeText } from "../../../../lib/admin-session";

function sanitizeContent(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return JSON.parse(JSON.stringify(value));
}

export async function GET(request: Request) {
  const unauthorized = await requireAdminSession(request);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const pageSlug = sanitizeSlug(searchParams.get("pageSlug") || "home");
    const db = getHeadlessDb();
    const sections = await db
      .select()
      .from(pageSections)
      .where(eq(pageSections.pageSlug, pageSlug))
      .orderBy(pageSections.order);

    return Response.json({ sections });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminSession(request);
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const db = getHeadlessDb();
    const pageSlug = sanitizeSlug(payload.pageSlug || "home");
    const sectionKey = sanitizeSlug(payload.sectionKey);
    const type = sanitizeSlug(payload.type || "rich_text");
    const order = Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0;
    const isVisible = Boolean(payload.isVisible);
    const content = sanitizeContent(payload.content);

    if (!pageSlug || !sectionKey) {
      return Response.json({ error: "pageSlug and sectionKey are required." }, { status: 400 });
    }

    const existing = await db
      .select({ id: pageSections.id })
      .from(pageSections)
      .where(and(eq(pageSections.pageSlug, pageSlug), eq(pageSections.sectionKey, sectionKey)))
      .limit(1);

    if (existing[0]) {
      await db
        .update(pageSections)
        .set({ type, order, isVisible, content, updatedAt: new Date() })
        .where(eq(pageSections.id, existing[0].id));
    } else {
      await db.insert(pageSections).values({
        pageSlug,
        sectionKey,
        type,
        order,
        isVisible,
        content,
      });
    }

    const path = pageSlug === "home" ? "/" : `/${sanitizeText(pageSlug, 120)}`;
    revalidatePath(path);

    return Response.json({ ok: true, path });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected error." }, { status: 500 });
  }
}
