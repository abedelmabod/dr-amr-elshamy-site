import type { Metadata } from "next";
import { ServiceDetailSite } from "../../DentalSite";

export const metadata: Metadata = {
  title: "Root Canal Treatment",
  description: "علاج العصب بأسلوب مريح وواضح في عيادة Dr. Amr Elshamy Dental Clinic.",
};

export default function RootCanal() {
  return <ServiceDetailSite slug="root-canal" />;
}
