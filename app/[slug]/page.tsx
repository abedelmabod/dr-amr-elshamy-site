import { notFound } from "next/navigation";
import { getPageCmsData } from "../../lib/cms";
import { SectionRenderer } from "../../lib/section-renderer";

export const revalidate = 3600;

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { sections } = await getPageCmsData(slug);
    if (!sections.length) notFound();

    return (
      <main className="site-shell">
        {sections.map((section) => (
          <SectionRenderer section={section} lang="ar" key={section.id} />
        ))}
      </main>
    );
  } catch {
    notFound();
  }
}
