import type { Metadata } from "next";
import { ServiceDetailSite } from "../../DentalSite";

export const metadata: Metadata = {
  title: "Dental Fillings",
  description: "حشو الأسنان وترميم التسوس بخيارات عملية ومريحة في عيادة Dr. Amr Elshamy.",
};

export default function DentalFillings() {
  return <ServiceDetailSite slug="dental-fillings" />;
}
