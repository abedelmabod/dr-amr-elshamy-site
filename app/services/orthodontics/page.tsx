import type { Metadata } from "next";
import { ServiceDetailSite } from "../../DentalSite";

export const metadata: Metadata = {
  title: "Orthodontics",
  description: "تقويم الأسنان للكبار والأطفال مع شرح الخطة ومتابعة مريحة في عيادة Dr. Amr Elshamy.",
};

export default function Orthodontics() {
  return <ServiceDetailSite slug="orthodontics" />;
}
