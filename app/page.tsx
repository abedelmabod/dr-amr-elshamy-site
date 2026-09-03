import type { Metadata } from "next";
import { DentalSite } from "./DentalSite";
import { metadataForPath } from "./seo-config";

const fallbackMetadata: Metadata = {
  title: "Premium Dental Care in Cairo",
  description:
    "Friendly dental and cosmetic care for adults and children with WhatsApp booking and patient reviews.",
};

export function generateMetadata() {
  return metadataForPath("/", fallbackMetadata);
}

export default function Home() {
  return <DentalSite page="home" />;
}
