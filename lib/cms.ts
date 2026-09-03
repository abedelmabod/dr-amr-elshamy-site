import { and, asc, eq } from "drizzle-orm";
import { getHeadlessDb } from "../db/headless-db";
import { globalSettings, pageSections, testimonials } from "../db/headless-schema";

export type CmsSection = typeof pageSections.$inferSelect;

export async function getGlobalSettings() {
  const db = getHeadlessDb();
  const [settings] = await db.select().from(globalSettings).where(eq(globalSettings.id, 1)).limit(1);
  return settings;
}

export async function getPageSections(pageSlug: string, includeHidden = false) {
  const db = getHeadlessDb();
  const filters = includeHidden
    ? eq(pageSections.pageSlug, pageSlug)
    : and(eq(pageSections.pageSlug, pageSlug), eq(pageSections.isVisible, true));

  return db.select().from(pageSections).where(filters).orderBy(asc(pageSections.order));
}

export async function getPageCmsData(pageSlug: string) {
  const [settings, sections] = await Promise.all([
    getGlobalSettings(),
    getPageSections(pageSlug),
  ]);

  return { settings, sections };
}

export async function getApprovedTestimonials(featuredOnly = false) {
  const db = getHeadlessDb();
  const filters = featuredOnly
    ? and(eq(testimonials.status, "approved"), eq(testimonials.featured, true))
    : eq(testimonials.status, "approved");

  return db.select().from(testimonials).where(filters).orderBy(asc(testimonials.id));
}

export function textValue(value: unknown, lang: "ar" | "en", fallback = "") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const localized = record[lang];
    if (typeof localized === "string") return localized;
  }
  return fallback;
}
