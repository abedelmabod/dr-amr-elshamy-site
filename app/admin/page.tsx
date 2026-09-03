import type { Metadata } from "next";
import { DentalSite } from "../DentalSite";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Secure content management dashboard for Dr. Amr Elshamy Dental Clinic.",
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <DentalSite page="admin" />;
}
