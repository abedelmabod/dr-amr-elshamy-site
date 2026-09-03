import type { Metadata } from "next";
import { DentalSite } from "../DentalSite";
import { metadataForPath } from "../seo-config";

const fallbackMetadata: Metadata = {
  title: "Dental Services",
  description: "خدمات أسنان شاملة في عيادة Dr. Amr Elshamy تشمل الزراعة، علاج العصب، التجميل، التقويم، الحشو، والأطفال.",
};

export function generateMetadata() {
  return metadataForPath("/services", fallbackMetadata);
}

export default function Services() {
  return <DentalSite page="services" />;
}
