import type { Metadata } from "next";
import { DentalSite } from "../DentalSite";
import { metadataForPath } from "../seo-config";

const fallbackMetadata: Metadata = {
  title: "Patient Reviews",
  description: "آراء وتجارب المرضى في عيادة Dr. Amr Elshamy Dental Clinic، مع إمكانية إرسال رأيك للمراجعة.",
};

export function generateMetadata() {
  return metadataForPath("/reviews", fallbackMetadata);
}

export default function Reviews() {
  return <DentalSite page="reviews" />;
}
