import type { Metadata } from "next";
import { DentalSite } from "../DentalSite";
import { metadataForPath } from "../seo-config";

const fallbackMetadata: Metadata = {
  title: "Contact & WhatsApp Booking",
  description: "احجز موعدك عبر واتساب أو تواصل مع عيادة Dr. Amr Elshamy Dental Clinic في مدينة نصر.",
};

export function generateMetadata() {
  return metadataForPath("/contact", fallbackMetadata);
}

export default function Contact() {
  return <DentalSite page="contact" />;
}
