import { textValue, type CmsSection } from "./cms";

type SectionRendererProps = {
  section: CmsSection;
  lang?: "ar" | "en";
};

export function SectionRenderer({ section, lang = "ar" }: SectionRendererProps) {
  const content = section.content as Record<string, unknown>;

  if (section.type === "hero") {
    return (
      <section className="cms-section cms-hero">
        {typeof content.image === "string" ? <img src={content.image} alt="" loading="lazy" /> : null}
        <div>
          <p className="section-label">{textValue(content.badge, lang)}</p>
          <h1>{textValue(content.title, lang)}</h1>
          <p>{textValue(content.subtitle, lang)}</p>
        </div>
      </section>
    );
  }

  if (section.type === "rich_text") {
    return (
      <section className="cms-section">
        <h2>{textValue(content.title, lang)}</h2>
        <p>{textValue(content.body, lang)}</p>
      </section>
    );
  }

  if (section.type === "image_grid") {
    const images = Array.isArray(content.images) ? content.images : [];
    return (
      <section className="cms-section cms-image-grid">
        <h2>{textValue(content.title, lang)}</h2>
        <div>
          {images.map((image, index) => (
            typeof image === "string" ? <img src={image} alt="" loading="lazy" key={`${image}-${index}`} /> : null
          ))}
        </div>
      </section>
    );
  }

  return null;
}
