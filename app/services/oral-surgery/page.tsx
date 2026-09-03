import type { Metadata } from "next";
import { ServiceDetailSite } from "../../DentalSite";

export const metadata: Metadata = {
  title: "Oral Surgery",
  description: "خدمات جراحة الفم وخلع الأسنان عند الحاجة مع شرح مطمئن ومتابعة في عيادة Dr. Amr Elshamy.",
};

export default function OralSurgery() {
  return <ServiceDetailSite slug="oral-surgery" />;
}
