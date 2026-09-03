import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailSite } from "../../DentalSite";
import { getDb } from "../../api/_lib";
import { absoluteUrl } from "../../site-meta";

type ArticleRow = {
  id: number;
  title: string;
  slug: string;
  meta_description?: string | null;
  cover_image?: string | null;
  body: string;
  conclusion: string;
  status: string;
  created_at?: string;
  updated_at?: string | null;
};

async function getArticle(slug: string) {
  const db = await getDb();
  return db.prepare(
    "SELECT id, title, slug, meta_description, cover_image, body, conclusion, status, created_at, updated_at FROM articles WHERE slug = ? AND status = ? AND (publish_at IS NULL OR publish_at = '' OR publish_at <= ?) LIMIT 1"
  )
    .bind(slug, "published", new Date().toISOString())
    .first<ArticleRow>();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const description = article.meta_description || article.body.slice(0, 160);
  const image = article.cover_image ? absoluteUrl(article.cover_image) : undefined;

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      images: image ? [{ url: image, width: 1200, height: 630, alt: article.title }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return <ArticleDetailSite article={article} />;
}
