import type { Metadata } from "next";
import { ServiceDetailSite } from "../../DentalSite";

export const metadata: Metadata = {
  title: "Teeth Whitening",
  description: "تبييض الأسنان واستعادة بريق الابتسامة بخطة مناسبة لحالتك في عيادة Dr. Amr Elshamy.",
};

export default function TeethWhitening() {
  return <ServiceDetailSite slug="teeth-whitening" />;
}
