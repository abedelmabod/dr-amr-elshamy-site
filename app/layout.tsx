import type { Metadata } from "next";
import "./globals.css";
import { absoluteUrl, googleSiteVerification, siteMetadata } from "./site-meta";

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: "%s | Dr. Amr Elshamy Dental Clinic",
  },
  description: siteMetadata.description,
  metadataBase: new URL(absoluteUrl("/")),
  keywords: [
    "Dr. Amr Elshamy",
    "Dental Clinic Cairo",
    "Dentist Nasr City",
    "Cosmetic Dentistry",
    "Dental Implants",
    "Orthodontics",
  ],
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    type: "website",
    siteName: "Dr. Amr Elshamy Dental Clinic",
    images: [{ url: absoluteUrl(siteMetadata.ogImage), width: 1200, height: 630, alt: "Dr. Amr Elshamy Dental Clinic" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [absoluteUrl(siteMetadata.ogImage)],
  },
  icons: {
    icon: "/brand/logo-transparent.png",
    shortcut: "/brand/logo-transparent.png",
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
};

const clinicSchema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Dr. Amr Elshamy Dental Clinic",
  image: "/brand/logo-transparent.png",
  telephone: ["+201090460873", "+201095686706"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nasr City",
    addressRegion: "Cairo",
    addressCountry: "EG",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61552675595435",
    "https://www.instagram.com/dramrelshamy.dentist",
    "https://www.tiktok.com/@dr..amr.elshamy",
  ],
  hasMap: "https://maps.app.goo.gl/UZEMhEpQh6PuaUDy5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }} />
        {children}
      </body>
    </html>
  );
}
