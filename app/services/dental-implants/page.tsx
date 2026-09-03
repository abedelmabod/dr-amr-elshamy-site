import type { Metadata } from "next";
import { ServiceDetailSite } from "../../DentalSite";

export const metadata: Metadata = {
  title: "Dental Implants",
  description: "زراعة الأسنان في عيادة Dr. Amr Elshamy بخطة واضحة، شرح مبسط، ومتابعة للنتيجة.",
};

export default function DentalImplants() {
  return <ServiceDetailSite slug="dental-implants" />;
}
