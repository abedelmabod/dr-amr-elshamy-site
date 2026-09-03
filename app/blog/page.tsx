import type { Metadata } from "next";
import { DentalSite } from "../DentalSite";
import { metadataForPath } from "../seo-config";

const fallbackMetadata: Metadata = {
  title: "Dental Blog",
  description: "مقالات ونصائح أسنان بسيطة للمرضى من عيادة Dr. Amr Elshamy Dental Clinic.",
};

export function generateMetadata() {
  return metadataForPath("/blog", fallbackMetadata);
}

export default function Blog() {
  return <DentalSite page="blog" />;
}
