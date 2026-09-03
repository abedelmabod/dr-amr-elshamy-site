import type { MetadataRoute } from "next";
import { getDb } from "./api/_lib";
import { siteUrl } from "./site-meta";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/services/dental-implants",
  "/services/root-canal",
  "/services/cosmetic-dentistry",
  "/services/orthodontics",
  "/services/teeth-whitening",
  "/services/pediatric-dentistry",
  "/services/dental-fillings",
  "/services/oral-surgery",
  "/cases",
  "/reviews",
  "/blog",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const db = await getDb();
  const articles = await db.prepare("SELECT slug, updated_at, created_at FROM articles WHERE status = ? AND (publish_at IS NULL OR publish_at = '' OR publish_at <= ?) ORDER BY id DESC")
    .bind("published", new Date().toISOString())
    .all<{ slug: string; updated_at?: string | null; created_at?: string | null }>();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route || "/"}`,
      lastModified: now,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...(articles.results || []).map((article) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: article.updated_at || article.created_at || now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
