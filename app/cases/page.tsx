import type { Metadata } from "next";
import { DentalSite } from "../DentalSite";
import { metadataForPath } from "../seo-config";

const fallbackMetadata: Metadata = {
  title: "Before & After Smile Gallery",
  description: "شاهد حالات قبل وبعد من نتائج عيادة Dr. Amr Elshamy مع تفاصيل نوع العلاج ومدته.",
};

export function generateMetadata() {
  return metadataForPath("/cases", fallbackMetadata);
}

export default function Cases() {
  return <DentalSite page="cases" />;
}
