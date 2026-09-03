import type { Metadata } from "next";
import { DentalSite } from "../DentalSite";
import { metadataForPath } from "../seo-config";

const fallbackMetadata: Metadata = {
  title: "About Dr. Amr Elshamy",
  description: "تعرف على دكتور عمرو الشامي وفلسفة العيادة في تقديم رعاية أسنان مريحة وواضحة للكبار والأطفال.",
};

export function generateMetadata() {
  return metadataForPath("/about", fallbackMetadata);
}

export default function About() {
  return <DentalSite page="about" />;
}
