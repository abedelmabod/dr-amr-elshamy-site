import type { Metadata } from "next";
import { ServiceDetailSite } from "../../DentalSite";

export const metadata: Metadata = {
  title: "Cosmetic Dentistry",
  description: "تجميل الأسنان وابتسامة أكثر ثقة في عيادة Dr. Amr Elshamy Dental Clinic.",
};

export default function CosmeticDentistry() {
  return <ServiceDetailSite slug="cosmetic-dentistry" />;
}
