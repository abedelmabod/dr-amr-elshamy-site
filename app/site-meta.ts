export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://dramrelshamy.com").replace(/\/$/, "");

export const siteMetadata = {
  name: "Dr. Amr Elshamy Dental Clinic",
  title: "Dr. Amr Elshamy Dental Clinic | Dental Care in Cairo",
  description:
    "عيادة Dr. Amr Elshamy Dental Clinic تقدم خدمات الأسنان والتجميل للكبار والأطفال مع حجز سريع عبر واتساب.",
  ogImage: "/brand/dr-amr-hero-premium.png",
};

export const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
