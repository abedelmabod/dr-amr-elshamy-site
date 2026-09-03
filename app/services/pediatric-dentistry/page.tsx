import type { Metadata } from "next";
import { ServiceDetailSite } from "../../DentalSite";

export const metadata: Metadata = {
  title: "Pediatric Dentistry",
  description: "رعاية أسنان الأطفال بتعامل هادئ وودود داخل عيادة Dr. Amr Elshamy Dental Clinic.",
};

export default function PediatricDentistry() {
  return <ServiceDetailSite slug="pediatric-dentistry" />;
}
