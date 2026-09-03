import type { Metadata } from "next";
import { getDb, parseJsonSetting, readSettings } from "./api/_lib";
import { absoluteUrl, siteMetadata } from "./site-meta";

export async function metadataForPath(path: string, fallback: Metadata): Promise<Metadata> {
  try {
    const db = await getDb();
    const settings = await readSettings(db);
    const seoPages = parseJsonSetting<Record<string, { title?: string; description?: string; ogImage?: string }>>(settings.seoPages, {});
    const override = seoPages[path];
    if (!override) return fallback;

    const title = override.title || fallback.title || siteMetadata.title;
    const description = override.description || fallback.description || siteMetadata.description;
    const image = override.ogImage ? absoluteUrl(override.ogImage) : absoluteUrl(siteMetadata.ogImage);
    return {
      ...fallback,
      title,
      description,
      openGraph: {
        title: String(title),
        description: String(description),
        images: [{ url: image, width: 1200, height: 630, alt: String(title) }],
      },
      twitter: {
        card: "summary_large_image",
        title: String(title),
        description: String(description),
        images: [image],
      },
    };
  } catch {
    return fallback;
  }
}
