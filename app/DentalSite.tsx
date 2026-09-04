"use client";

import {
  ArrowLeft,
  ArrowRight,
  Baby,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Edit3,
  Eye,
  EyeOff,
  HeartHandshake,
  ImageIcon,
  Lock,
  LogOut,
  MapPin,
  Menu,
  Phone,
  SearchCheck,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Star,
  Stethoscope,
  UsersRound,
  X,
} from "lucide-react";
import { createContext, type CSSProperties, FormEvent, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Lang = "ar" | "en";
type Page = "home" | "about" | "services" | "service-detail" | "cases" | "reviews" | "blog" | "contact" | "admin" | "not-found";
type ServiceSlug =
  | "dental-implants"
  | "root-canal"
  | "cosmetic-dentistry"
  | "orthodontics"
  | "teeth-whitening"
  | "pediatric-dentistry"
  | "dental-fillings"
  | "oral-surgery";

type Review = { id: number; name: string; rating: number; message: string; status?: string };
type Article = { id: number; title: string; slug?: string; meta_description?: string | null; excerpt_ar?: string | null; excerpt_en?: string | null; cover_image?: string | null; body: string; conclusion: string; category?: string | null; author?: string | null; featured?: number | boolean | null; faq_items?: string | null; status?: string; created_at?: string; updated_at?: string | null; publish_at?: string | null };
type GalleryItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  before_image?: string | null;
  after_image?: string | null;
  duration?: string | null;
  featured?: number | boolean | null;
  status?: string;
};
type ServiceItem = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_ar: string;
  description_en: string;
  whatsapp_message_ar?: string | null;
  whatsapp_message_en?: string | null;
  icon: string;
  sort_order: number;
  featured?: number | boolean | null;
  status?: string;
};
type HomeConfig = { serviceIds: number[]; articleIds: number[]; caseIds: number[]; reviewIds?: number[] };
type DoctorProfile = {
  nameAr?: string;
  nameEn?: string;
  titleAr?: string;
  titleEn?: string;
  bioAr?: string;
  bioEn?: string;
  certifications?: string;
  yearsExperience?: string;
  imageUrl?: string;
};
type FaqItem = { id: number; question_ar: string; question_en: string; answer_ar: string; answer_en: string; page: string; sort_order: number };
type HeroConfig = Record<string, string>;
type ThemeConfig = { gold?: string; bronze?: string; charcoal?: string; background?: string; darkModeEnabled?: boolean; buttonStyle?: string; cardRadius?: string; shadowLevel?: string; headingScale?: string; bodyScale?: string };
type LayoutConfig = { sections?: string[]; hiddenSections?: string[]; previewMode?: boolean };
type HeaderFooterConfig = { logo?: string; footerTextAr?: string; footerTextEn?: string; showSocial?: boolean; navOrder?: string[] };
type BannerConfig = { enabled?: boolean; textAr?: string; textEn?: string; link?: string };
type FormConfig = { requireName?: boolean; requirePhone?: boolean; showAge?: boolean; showImage?: boolean; showDate?: boolean; showMessage?: boolean };
type ScriptsConfig = { googleAnalytics?: string; metaPixel?: string; tiktokPixel?: string; googleTagManager?: string };
type BuilderTextPair = { ar?: string; en?: string };
type BuilderCard = BuilderTextPair & { icon?: string; textAr?: string; textEn?: string; image?: string; enabled?: boolean };
type BuilderJourneyStep = { key?: string; titleAr?: string; titleEn?: string; textAr?: string; textEn?: string; icon?: string; enabled?: boolean };
type BuilderQuizOption = { key?: string; labelAr?: string; labelEn?: string; messageAr?: string; messageEn?: string; enabled?: boolean };
type BuilderConfig = {
  trustItems?: BuilderCard[];
  journeySteps?: BuilderJourneyStep[];
  quizOptions?: BuilderQuizOption[];
  comfortItems?: BuilderCard[];
  patientQuestions?: Array<{ questionAr?: string; questionEn?: string; answerAr?: string; answerEn?: string; enabled?: boolean }>;
  clinicTour?: Array<{ image?: string; altAr?: string; altEn?: string; enabled?: boolean }>;
  blogThumbs?: string[];
  implantSection?: { labelAr?: string; labelEn?: string; titleAr?: string; titleEn?: string; textAr?: string; textEn?: string; image?: string; buttonAr?: string; buttonEn?: string; linkTextAr?: string; linkTextEn?: string };
  previewSection?: { labelAr?: string; labelEn?: string; titleAr?: string; titleEn?: string; textAr?: string; textEn?: string; buttonAr?: string; buttonEn?: string; namePlaceholderAr?: string; namePlaceholderEn?: string; problemPlaceholderAr?: string; problemPlaceholderEn?: string };
  casesPage?: { labelAr?: string; labelEn?: string; titleAr?: string; titleEn?: string; textAr?: string; textEn?: string; proof1Ar?: string; proof1En?: string; proof2Ar?: string; proof2En?: string; proof3Ar?: string; proof3En?: string };
  articleLabels?: { detailLabelAr?: string; detailLabelEn?: string; footerLabelAr?: string; footerLabelEn?: string; shareAr?: string; shareEn?: string };
};
const reviewScreenshotCount = 78;
const reviewScreenshotsPerPage = 12;

type SiteSettings = {
  phonePrimary: string;
  phoneSecondary: string;
  whatsappPhone: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  mapUrl: string;
  email: string;
};
type SiteData = {
  reviews: Review[];
  articles: Article[];
  gallery: GalleryItem[];
  services?: ServiceItem[];
  faq?: FaqItem[];
  settings?: SiteSettings;
  homeConfig?: HomeConfig;
  siteText?: Record<string, string>;
  heroConfig?: HeroConfig;
  themeConfig?: ThemeConfig;
  layoutConfig?: LayoutConfig;
  headerFooterConfig?: HeaderFooterConfig;
  bannerConfig?: BannerConfig;
  formConfig?: FormConfig;
  languageOverrides?: Record<string, string>;
  scriptsConfig?: ScriptsConfig;
  builderConfig?: BuilderConfig;
  doctorProfile?: DoctorProfile;
  seoPages?: Record<string, { title?: string; description?: string; ogImage?: string }>;
};
type AdminSessionInfo = {
  authenticated: boolean;
  username?: string;
  role?: string;
  permissions?: string[];
  isSuperAdmin?: boolean;
};
type LiveEditTarget = {
  group: "siteText" | "heroConfig" | "headerFooterConfig" | "builderConfig" | "layoutConfig" | "themeConfig";
  field: string;
  type?: "text" | "image";
};
type LiveEditContextValue = {
  enabled: boolean;
  save: (target: LiveEditTarget, value: string) => Promise<boolean>;
  uploadImage: (file: File | undefined) => Promise<string>;
  updateSection: (key: string, action: "hide" | "up" | "down") => Promise<void>;
};
const LiveEditContext = createContext<LiveEditContextValue>({
  enabled: false,
  save: async () => false,
  uploadImage: async () => "",
  updateSection: async () => undefined,
});
type ParsedCase = GalleryItem & {
  beforeImage: string;
  afterImage: string;
  duration: string;
  featured: boolean;
};

const whatsappPrimary = "201090460873";
const whatsappSecondary = "+20 10 95686706";
const mapUrl = "https://maps.app.goo.gl/UZEMhEpQh6PuaUDy5?g_st=ic";
const facebookUrl = "https://www.facebook.com/profile.php?id=61552675595435&mibextid=wwXIfr";
const instagramUrl = "https://www.instagram.com/dramrelshamy.dentist";
const tiktokUrl = "https://www.tiktok.com/@dr..amr.elshamy";
const defaultSiteSettings: SiteSettings = {
  phonePrimary: "+20 10 90460873",
  phoneSecondary: whatsappSecondary,
  whatsappPhone: whatsappPrimary,
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  mapUrl,
  email: "info@dramrelshamy.com",
};

const nav = [
  { page: "home", href: "/", ar: "الرئيسية", en: "Home" },
  { page: "about", href: "/about", ar: "عن الدكتور", en: "About" },
  { page: "services", href: "/services", ar: "الخدمات", en: "Services" },
  { page: "cases", href: "/cases", ar: "قبل وبعد", en: "Before & After" },
  { page: "reviews", href: "/reviews", ar: "آراء المرضى", en: "Reviews" },
  { page: "blog", href: "/blog", ar: "المقالات", en: "Blog" },
  { page: "contact", href: "/contact", ar: "تواصل", en: "Contact" },
] as const;

const copy = {
  ar: {
    dir: "rtl",
    badge: "رعاية أسنان وتجميل بابتسامة مطمئنة",
    title: "ابتسامتك تبدأ من هنا",
    subtitle:
      "في عيادة Dr. Amr Elshamy بنهتم براحتك من أول رسالة واتساب لحد نتيجة العلاج. خدمات أسنان للكبار والأطفال بأسلوب بسيط وودود.",
    book: "احجز عبر واتساب",
    servicesCta: "استكشف الخدمات",
    rating: "تقييمات مرضى حقيقية",
    safe: "تعقيم وأمان",
    stats: [
      ["100/100", "حالات ناجحة", "نتائج حقيقية موثقة"],
      ["20/100", "راحة أثناء العلاج", "تجربة هادئة وبسيطة"],
      ["15+", "خدمات أسنان", "للكبار والأطفال"],
    ],
    pages: {
      about: ["عن الدكتور", "دكتور عمرو الشامي", "زيارة الأسنان تكون أسهل لما الدكتور يسمعك ويشرح لك الخطة ببساطة."],
      services: ["خدماتنا", "خدمات أسنان شاملة", "كل خدمات الأسنان الأساسية والتجميلية للكبار والأطفال في مكان واحد."],
      cases: ["قبل وبعد", "نتائج من شغل العيادة", "صور حقيقية من الحالات المسموح بعرضها."],
      reviews: ["آراء المرضى", "مرضانا بيقولوا إيه؟", "اقرأ تجارب المرضى، واكتب رأيك ليظهر بعد موافقة الأدمن."],
      blog: ["المدونة", "مقالات ونصائح", "مقالات يضيفها الأدمن لمساعدة المرضى بمعلومات بسيطة ومفيدة."],
      contact: ["تواصل معنا", "احجز كشفك بخطوة بسيطة", "اكتب بياناتك والرسالة هتتجهز تلقائيًا على واتساب."],
      admin: ["لوحة التحكم", "إدارة محتوى الموقع", "إضافة مقالات وصور، ومراجعة آراء المرضى قبل عرضها."],
    },
    formName: "الاسم",
    formPhone: "رقم الهاتف",
    formService: "الخدمة المطلوبة",
    formMessage: "اكتب رسالتك",
    sendWhatsApp: "إرسال على واتساب",
    addReview: "اكتب رأيك",
    reviewHint: "الرأي هيظهر بعد موافقة الأدمن.",
    admin: "دخول الأدمن",
    password: "كلمة المرور",
    login: "دخول",
    logout: "خروج",
    approve: "موافقة",
    hide: "إخفاء",
    delete: "حذف",
    addArticle: "إضافة مقال",
    addGallery: "إضافة صورة",
    articleTitle: "عنوان المقال",
    articleBody: "المقالة",
    articleEnd: "نهاية المقالة",
    imageUrl: "رابط الصورة",
    category: "التصنيف",
    save: "حفظ",
    pending: "بانتظار الموافقة",
    footer: "رعاية أسنان ودودة، واضحة، ومناسبة لكل أفراد الأسرة.",
    address: "موقع العيادة على خرائط جوجل",
  },
  en: {
    dir: "ltr",
    badge: "Premium friendly dental and cosmetic care",
    title: "Your Perfect Smile Starts Here",
    subtitle:
      "At Dr. Amr Elshamy Dental Clinic, booking is simple, care is gentle, and every treatment plan is explained clearly for adults and children.",
    book: "Book on WhatsApp",
    servicesCta: "Explore Services",
    rating: "Real patient ratings",
    safe: "Sterilization & safety",
    stats: [
      ["100/100", "Successful cases", "Documented real results"],
      ["20/100", "Comfort-first care", "Calm and simple visits"],
      ["15+", "Dental services", "Adults and children"],
    ],
    pages: {
      about: ["About Dr. Amr", "Dr. Amr Elshamy", "Dental visits feel easier when the plan is clear and the care is calm."],
      services: ["Our Services", "Comprehensive Dental Solutions", "Core and cosmetic dental services for adults and children in one place."],
      cases: ["Before & After", "Clinic Work Gallery", "Real case images approved for display."],
      reviews: ["Testimonials", "What Our Patients Say", "Read patient experiences and submit yours for admin approval."],
      blog: ["Blog", "Articles & Tips", "Helpful articles added by the admin for simple patient education."],
      contact: ["Contact", "Book your visit in one simple step", "Enter your details and the message will be prepared automatically on WhatsApp."],
      admin: ["Control Panel", "Manage Site Content", "Add articles and cases, and approve patient reviews."],
    },
    formName: "Name",
    formPhone: "Phone",
    formService: "Requested service",
    formMessage: "Your message",
    sendWhatsApp: "Send on WhatsApp",
    addReview: "Add your review",
    reviewHint: "Your review appears after admin approval.",
    admin: "Admin Login",
    password: "Password",
    login: "Login",
    logout: "Logout",
    approve: "Approve",
    hide: "Hide",
    delete: "Delete",
    addArticle: "Add Article",
    addGallery: "Add Case",
    articleTitle: "Article title",
    articleBody: "Article body",
    articleEnd: "Article ending",
    imageUrl: "Image URL",
    category: "Category",
    save: "Save",
    pending: "Pending approval",
    footer: "Friendly, clear dental care for the whole family.",
    address: "Clinic location on Google Maps",
  },
} as const;

const services = [
  ["Dental Implants", "زراعة الأسنان", "تعويض الأسنان المفقودة بشكل ثابت وطبيعي.", "Stable, natural-looking replacement for missing teeth."],
  ["Root Canal Treatment", "علاج العصب", "علاج الألم والحفاظ على السن بخطوات مريحة.", "Pain relief and tooth saving with a gentle process."],
  ["Cosmetic Dentistry", "تجميل الأسنان", "فينير، بوندنج، وتنسيق الابتسامة.", "Veneers, bonding, and smile design."],
  ["Orthodontics", "تقويم الأسنان", "حلول تقويم للكبار والأطفال.", "Alignment options for adults and children."],
  ["Teeth Whitening", "تبييض الأسنان", "تفتيح آمن للون الأسنان وابتسامة أوضح.", "Safe whitening for a brighter smile."],
  ["Pediatric Dentistry", "أسنان الأطفال", "تعامل هادي وودود مع الأطفال.", "Friendly, calm care for children."],
  ["Dental Fillings", "الحشو التجميلي", "حشوات بلون السن للحفاظ على الشكل والوظيفة.", "Tooth-colored fillings for form and function."],
  ["Oral Surgery", "جراحة الفم", "خلع وجراحات بسيطة باهتمام كامل بالراحة.", "Simple surgical care with comfort in mind."],
];

const serviceSlugs: ServiceSlug[] = [
  "dental-implants",
  "root-canal",
  "cosmetic-dentistry",
  "orthodontics",
  "teeth-whitening",
  "pediatric-dentistry",
  "dental-fillings",
  "oral-surgery",
];

const serviceIcons = [
  "/icons/implant.png",
  "/icons/root-canal.png",
  "/icons/whitening.png",
  "/icons/aligners.png",
  "/icons/whitening.png",
  "/icons/comfort-face.png",
  "/icons/root-canal.png",
  "/icons/sterilization-shield.png",
];

const metricIcons = ["/icons/success-chart.png", "/icons/comfort-face.png", "/icons/trophy.png"];

function serviceListFromData(data?: SiteData) {
  if (data?.services?.length) {
    return data.services.map((service, index) => ({
      id: service.id,
      slug: service.slug,
      titleEn: service.title_en,
      titleAr: service.title_ar,
      descriptionAr: service.description_ar,
      descriptionEn: service.description_en,
      whatsappMessageAr: service.whatsapp_message_ar || "",
      whatsappMessageEn: service.whatsapp_message_en || "",
      icon: service.icon || serviceIcons[index % serviceIcons.length],
      featured: Boolean(service.featured),
    }));
  }

  return services.map((service, index) => ({
    id: index + 1,
    slug: serviceSlugs[index],
    titleEn: service[0],
    titleAr: service[1],
    descriptionAr: service[2],
    descriptionEn: service[3],
    whatsappMessageAr: "",
    whatsappMessageEn: "",
    icon: serviceIcons[index],
    featured: true,
  }));
}

const clinicTour = [
  "/inner/clinic-reception.png",
  "/inner/clinic-treatment.png",
  "/inner/clinic-sterilization.png",
  "/inner/clinic-hallway.png",
];

const blogThumbs = ["/inner/blog-hygiene.png", "/inner/blog-cosmetic.png", "/inner/blog-aligners.png"];

const journeySteps = [
  ["WhatsApp", "أول رسالة واتساب", "نبعتلك رد سريع ونفهم المشكلة ببساطة.", "Send a quick message and we understand the concern."],
  ["Checkup", "الكشف", "تشخيص هادئ وصور أو فحص حسب الحالة.", "A calm checkup with the right diagnosis."],
  ["Plan", "خطة العلاج", "شرح البدائل والتكلفة المتوقعة قبل أي خطوة.", "Clear options before any treatment step."],
  ["Care", "التنفيذ", "علاج مريح بمعايير تعقيم عالية.", "Comfort-first treatment with strong sterilization."],
  ["Follow-up", "المتابعة", "نطمن على النتيجة ونرد على أي سؤال.", "Follow-up support after the visit."],
];

const quizOptions = [
  ["pain", "ألم أو عصب", "Pain or root canal", "عندي ألم أو محتاج كشف عصب"],
  ["cosmetic", "تجميل ابتسامة", "Cosmetic smile", "محتاج حل تجميلي للابتسامة"],
  ["orthodontics", "تقويم", "Orthodontics", "محتاج أعرف أنسب حل للتقويم"],
  ["child", "طفل", "Child visit", "الحجز لطفل ومحتاج تعامل هادي"],
  ["implant", "زراعة", "Implants", "محتاج استشارة زراعة أسنان"],
];

const comfortItems = [
  ["تعقيم واضح", "Sterilization", "كل خطوة علاجية مرتبطة بمسار نظافة وتعقيم مطمئن.", "/icons/sterilization-shield.png"],
  ["شرح قبل العلاج", "Clear Explanation", "بنشرح الحالة والاختيارات بلغة بسيطة قبل التنفيذ.", "/icons/success-chart.png"],
  ["تعامل هادئ مع الأطفال", "Kids Friendly", "الزيارة تكون أهدى وأسهل للأطفال والأهل.", "/icons/comfort-face.png"],
  ["متابعة بعد الزيارة", "Follow-up", "تقدر تبعت على واتساب لو عندك سؤال بعد الكشف.", "/icons/trophy.png"],
  ["خطط علاج واضحة", "Clear Treatment Plans", "كل خطوة لها سبب وتوقعات واضحة عشان القرار يكون مطمئن.", "/icons/root-canal.png"],
];

const patientQuestions = [
  ["هل علاج العصب مؤلم؟", "Is root canal painful?", "العلاج الحديث هدفه تقليل الألم، والخطة بتتشرح قبل البداية."],
  ["إمتى أحتاج زراعة؟", "When do I need implants?", "لما يكون في سن مفقود ومحتاج تعويض ثابت وطبيعي."],
  ["هل التبييض مناسب لكل الناس؟", "Is whitening for everyone?", "الأفضل كشف بسيط عشان نحدد سبب اللون وأنسب طريقة."],
  ["طفلي خايف من دكتور الأسنان، أعمل إيه؟", "What if my child is afraid?", "نبدأ بزيارة هادية وتعريف الطفل بالمكان من غير ضغط."],
];

function enabledItems<T extends { enabled?: boolean }>(items: T[] | undefined, fallback: T[]) {
  const source = items?.length ? items : fallback;
  return source.filter((item) => item.enabled !== false);
}

function localizedPair(item: BuilderTextPair, isArabic: boolean, fallbackAr = "", fallbackEn = fallbackAr) {
  return isArabic ? (item.ar || fallbackAr) : (item.en || fallbackEn);
}

function builderIcon(name = "sparkles", size = 18) {
  const key = name.toLowerCase();
  if (key.includes("whatsapp")) return <WhatsAppIcon size={size} />;
  if (key.includes("shield") || key.includes("sterile")) return <ShieldCheck size={size} />;
  if (key.includes("smile")) return <SmilePlus size={size} />;
  if (key.includes("users") || key.includes("kids")) return <UsersRound size={size} />;
  if (key.includes("search") || key.includes("check")) return <SearchCheck size={size} />;
  if (key.includes("clipboard") || key.includes("plan")) return <ClipboardCheck size={size} />;
  if (key.includes("heart") || key.includes("follow")) return <HeartHandshake size={size} />;
  if (key.includes("doctor") || key.includes("treatment")) return <Stethoscope size={size} />;
  if (key.includes("calendar")) return <CalendarCheck size={size} />;
  if (key.includes("baby") || key.includes("child")) return <Baby size={size} />;
  return <Sparkles size={size} />;
}

function renderServiceVisual(icon: string, size = 44) {
  if (icon.startsWith("/") || icon.startsWith("http")) {
    return <img className="service-icon-3d" src={icon} alt="" aria-hidden="true" loading="lazy" />;
  }

  return <span className="service-icon-symbol" aria-hidden="true">{builderIcon(icon, size)}</span>;
}

const cmsIconOptions = [
  { key: "sparkles", ar: "لمعة", en: "Sparkles" },
  { key: "whatsapp", ar: "واتساب", en: "WhatsApp" },
  { key: "shield", ar: "تعقيم", en: "Shield" },
  { key: "smile", ar: "ابتسامة", en: "Smile" },
  { key: "users", ar: "مرضى", en: "Patients" },
  { key: "search", ar: "كشف", en: "Checkup" },
  { key: "plan", ar: "خطة", en: "Plan" },
  { key: "follow", ar: "متابعة", en: "Follow-up" },
  { key: "treatment", ar: "علاج", en: "Treatment" },
  { key: "calendar", ar: "مواعيد", en: "Calendar" },
  { key: "child", ar: "أطفال", en: "Kids" },
];

function AdminIconPicker({
  label,
  value,
  onChange,
  isArabic,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isArabic: boolean;
}) {
  return (
    <div className="admin-icon-picker">
      <div className="admin-icon-picker-head">
        <span>{label}</span>
        <strong>{builderIcon(value || "sparkles", 18)} {cmsIconOptions.find((item) => item.key === value)?.[isArabic ? "ar" : "en"] || value || "sparkles"}</strong>
      </div>
      <div className="admin-icon-options" role="listbox" aria-label={label}>
        {cmsIconOptions.map((item) => (
          <button
            className={(value || "sparkles") === item.key ? "active" : ""}
            type="button"
            key={item.key}
            onClick={() => onChange(item.key)}
            title={isArabic ? item.ar : item.en}
          >
            {builderIcon(item.key, 18)}
            <span>{isArabic ? item.ar : item.en}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ServiceDetailSite({ slug }: { slug: ServiceSlug }) {
  return <DentalSite page="service-detail" serviceSlug={slug} />;
}

export function ArticleDetailSite({ article }: { article: Article }) {
  return <DentalSite page="blog" article={article} />;
}

function whatsappLink(message: string, phone = whatsappPrimary) {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
}

function serviceWhatsAppMessage(slug: ServiceSlug | undefined, isArabic: boolean) {
  if (!slug) {
    return isArabic
      ? "مرحباً، محتاج حجز في عيادة Dr. Amr Elshamy."
      : "Hello, I need an appointment at Dr. Amr Elshamy Dental Clinic.";
  }

  const { service } = getServiceBySlug(slug);
  return isArabic
    ? `مرحباً، محتاج استشارة ${service[1]} في عيادة Dr. Amr Elshamy.\nممكن أعرف أقرب تفاصيل مناسبة؟`
    : `Hello, I need a ${service[0]} consultation at Dr. Amr Elshamy Dental Clinic.\nCould you share the next suitable details?`;
}

function parseCase(item: GalleryItem, index = 0): ParsedCase {
  if (item.before_image || item.after_image) {
    return {
      ...item,
      beforeImage: item.before_image || item.image,
      afterImage: item.after_image || item.image,
      duration: item.duration || "حسب الحالة",
      featured: item.featured === 1 || item.featured === true,
    };
  }

  try {
    const payload = JSON.parse(item.image) as Partial<ParsedCase> & { image?: string };
    return {
      ...item,
      beforeImage: payload.beforeImage || payload.image || item.image,
      afterImage: payload.afterImage || payload.beforeImage || payload.image || item.image,
      duration: payload.duration || "حسب الحالة",
      featured: Boolean(payload.featured),
    };
  } catch {
    const fallbackAfter = `/cases/case-${((index + 1) % 6) + 1}.${index === 0 ? "png" : "jpg"}`;
    return {
      ...item,
      beforeImage: item.image,
      afterImage: fallbackAfter,
      duration: "حسب الحالة",
      featured: index < 2,
    };
  }
}

const fallbackData: SiteData = {
  reviews: [
    { id: 1, name: "Kareem Y.", rating: 5, message: "فريق طبي ممتاز، دكاترة ومساعدين واستقبال. كل تخصص له الدكتور المختص فيه، وده شيء ممتاز جدا. نظافة ونظام في المواعيد ورقي في التعامل مع العيانين." },
    { id: 2, name: "Areej M.", rating: 5, message: "دكتور شاطر جدا وكان صبور جدا معايا وبيشرحلي كل حاجة بتتعمل. بجد تسلم إيدك." },
    { id: 3, name: "Ahmed m.", rating: 5, message: "It was a very great clinic. No waiting time and everyone was very kind and respectful. The staff was amazing. Highly recommended." },
  ],
  articles: [
    {
      id: 1,
      title: "هل علاج العصب مؤلم؟",
      slug: "هل-علاج-العصب-مؤلم",
      meta_description: "إجابة بسيطة عن ألم علاج العصب، خطوات تقليل التوتر، ومتى تحتاج للكشف.",
      body: "علاج العصب الحديث هدفه الأساسي تقليل الألم والحفاظ على السن. قبل البداية بنشرح الحالة، سبب الألم، والخطوات المتوقعة عشان المريض يدخل مطمئن.",
      conclusion: "الكشف المبكر وشرح الخطة بوضوح بيخلوا التجربة أهدى وأسهل.",
    },
    {
      id: 2,
      title: "إمتى أحتاج زراعة أسنان؟",
      slug: "إمتى-أحتاج-زراعة-أسنان",
      meta_description: "تعرف على الحالات التي تحتاج زراعة أسنان وكيف تساعد في تعويض السن المفقود.",
      body: "زراعة الأسنان تكون مناسبة غالباً عند فقد سن أو أكثر والحاجة لتعويض ثابت يشبه الشكل والوظيفة الطبيعية. القرار يعتمد على حالة العظم واللثة والصحة العامة.",
      conclusion: "استشارة الزراعة بتوضح هل الزراعة أنسب حل لحالتك أم يوجد بديل أفضل.",
    },
    {
      id: 3,
      title: "هل تبييض الأسنان آمن لكل الناس؟",
      slug: "هل-تبييض-الأسنان-آمن",
      meta_description: "متى يكون تبييض الأسنان مناسباً، ومتى تحتاج لعلاج سبب تغير اللون أولاً.",
      body: "التبييض قد يكون مناسباً لحالات كثيرة، لكن الأفضل معرفة سبب تغير اللون أولاً. أحياناً يكون السبب تصبغات سطحية، وأحياناً يحتاج السن لعلاج أو تنظيف قبل التبييض.",
      conclusion: "الكشف البسيط يحدد الطريقة الآمنة والنتيجة المتوقعة.",
    },
  ],
  gallery: Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    title: `Case ${index + 1}`,
    category: "Before & After",
    image: `/cases/case-${index + 1}.${index === 1 ? "png" : "jpg"}`,
  })),
  faq: [],
};

export function DentalSite({ page = "home", serviceSlug, article }: { page?: Page; serviceSlug?: ServiceSlug; article?: Article }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<SiteData>(fallbackData);
  const [booking, setBooking] = useState({ name: "", phone: "", service: "", message: "" });
  const [review, setReview] = useState({ name: "", rating: 5, message: "" });
  const [reviewSent, setReviewSent] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [adminSession, setAdminSession] = useState<AdminSessionInfo | null>(null);

  const t = copy[lang];
  const isArabic = lang === "ar";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    localStorage.setItem("theme", dark ? "dark" : "light");
    localStorage.setItem("lang", lang);
  }, [dark, lang, t.dir]);

  useEffect(() => {
    const theme = data.themeConfig || {};
    const root = document.documentElement;
    if (theme.gold) root.style.setProperty("--gold", theme.gold);
    if (theme.bronze) root.style.setProperty("--gold-bronze", theme.bronze);
    if (theme.charcoal) root.style.setProperty("--charcoal", theme.charcoal);
    if (theme.background) root.style.setProperty("--bg", theme.background);
    if (theme.cardRadius) root.style.setProperty("--cms-card-radius", `${theme.cardRadius}px`);
    if (theme.shadowLevel) root.style.setProperty("--cms-shadow-level", theme.shadowLevel);
    if (theme.bodyScale) root.style.setProperty("--cms-body-scale", theme.bodyScale);
    const headingScale = Math.min(1.12, Math.max(0.9, Number(theme.headingScale) || 1));
    root.style.setProperty("--cms-hero-title-min", `${Math.round(38 * headingScale)}px`);
    root.style.setProperty("--cms-hero-title-max", `${Math.round(92 * headingScale)}px`);
    root.style.setProperty("--cms-section-title-min", `${Math.round(32 * headingScale)}px`);
    root.style.setProperty("--cms-section-title-max", `${Math.round(64 * headingScale)}px`);
    root.dataset.buttonStyle = theme.buttonStyle || "gradient";
  }, [data.themeConfig]);

  useEffect(() => {
    fetch("/api/site")
      .then((response) => (response.ok ? response.json() : fallbackData))
      .then((payload: SiteData) =>
        {
          setData({
            reviews: payload.reviews?.length ? payload.reviews : fallbackData.reviews,
            articles: payload.articles?.length ? payload.articles : fallbackData.articles,
            gallery: payload.gallery?.length ? payload.gallery : fallbackData.gallery,
            services: payload.services || [],
            faq: payload.faq || [],
            settings: payload.settings,
            homeConfig: payload.homeConfig,
            siteText: payload.siteText,
            heroConfig: payload.heroConfig,
            themeConfig: payload.themeConfig,
            layoutConfig: payload.layoutConfig,
            headerFooterConfig: payload.headerFooterConfig,
            bannerConfig: payload.bannerConfig,
            formConfig: payload.formConfig,
            languageOverrides: payload.languageOverrides,
            scriptsConfig: payload.scriptsConfig,
            builderConfig: payload.builderConfig,
            doctorProfile: payload.doctorProfile,
            seoPages: payload.seoPages,
          });
          if (payload.settings) setSettings({ ...defaultSiteSettings, ...payload.settings });
        }
      )
      .catch(() => setData(fallbackData));
  }, []);

  useEffect(() => {
    fetch("/api/track-visitor", { method: "POST" }).catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.ok ? response.json() : null)
      .then((session: AdminSessionInfo | null) => setAdminSession(session))
      .catch(() => setAdminSession(null));
  }, []);

  useEffect(() => {
    const label = page === "service-detail" && serviceSlug ? `service/${serviceSlug}` : page === "blog" && article?.slug ? `blog/${article.slug}` : page;
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view", label }),
    }).catch(() => undefined);
  }, [page, serviceSlug, article?.slug]);

  const bookingUrl = useMemo(() => {
    const lines = [
      isArabic ? "مرحبًا، أريد حجز موعد في عيادة Dr. Amr Elshamy." : "Hello, I would like to book an appointment at Dr. Amr Elshamy Dental Clinic.",
      booking.name ? `${isArabic ? "الاسم" : "Name"}: ${booking.name}` : "",
      booking.phone ? `${isArabic ? "الهاتف" : "Phone"}: ${booking.phone}` : "",
      booking.service ? `${isArabic ? "الخدمة" : "Service"}: ${booking.service}` : "",
      booking.message ? `${isArabic ? "الرسالة" : "Message"}: ${booking.message}` : "",
    ].filter(Boolean);

    return `https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [booking, isArabic, settings.whatsappPhone]);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    }).catch(() => null);
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "booking_submit", label: booking.service || "general" }),
    }).catch(() => null);
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
    setBookingSent(true);
  }

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    if (response.ok) {
      fetch("/api/track-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "review_submit", label: "public_form" }),
      }).catch(() => null);
      setReview({ name: "", rating: 5, message: "" });
      setReviewSent(true);
    }
  }

  function updateLocalConfig(target: LiveEditTarget, value: string) {
    setData((current) => {
      const currentGroup = ((current[target.group] as Record<string, unknown> | undefined) || {});
      const nextGroup = { ...currentGroup };
      const parts = target.field.split(".").filter(Boolean);
      let cursor: Record<string, unknown> = nextGroup;
      for (const part of parts.slice(0, -1)) {
        const child = cursor[part];
        cursor[part] = child && typeof child === "object" && !Array.isArray(child) ? { ...(child as Record<string, unknown>) } : {};
        cursor = cursor[part] as Record<string, unknown>;
      }
      cursor[parts[parts.length - 1]] = value;
      return { ...current, [target.group]: nextGroup };
    });
  }

  async function saveLiveEdit(target: LiveEditTarget, value: string) {
    const response = await fetch("/api/admin/live-edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group: target.group, key: target.field, value, type: target.type || "text" }),
    });
    if (response.ok) {
      updateLocalConfig(target, value);
      return true;
    }
    return false;
  }

  async function uploadLiveImage(file: File | undefined) {
    return uploadAdminImage(file, isArabic, () => undefined);
  }

  async function updateLiveSection(key: string, action: "hide" | "up" | "down") {
    const defaultSectionOrder = ["hero", "stats", "trust", "implant", "journey", "quiz", "preview", "comfort", "services", "reviews"];
    const currentLayout = data.layoutConfig || {};
    const sections = [...(currentLayout.sections?.length ? currentLayout.sections : defaultSectionOrder)];
    const hiddenSections = new Set(currentLayout.hiddenSections || []);
    if (action === "hide") {
      hiddenSections.has(key) ? hiddenSections.delete(key) : hiddenSections.add(key);
    } else {
      const index = sections.indexOf(key);
      const nextIndex = action === "up" ? index - 1 : index + 1;
      if (index >= 0 && nextIndex >= 0 && nextIndex < sections.length) {
        [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
      }
    }
    const nextLayout = { ...currentLayout, sections, hiddenSections: Array.from(hiddenSections) };
    setData((current) => ({ ...current, layoutConfig: nextLayout }));
    await fetch("/api/admin/live-edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group: "layoutConfig", key: "sections", value: sections }),
    });
    await fetch("/api/admin/live-edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group: "layoutConfig", key: "hiddenSections", value: Array.from(hiddenSections) }),
    });
  }

  const liveEdit = useMemo<LiveEditContextValue>(() => ({
    enabled: Boolean(adminSession?.isSuperAdmin && page !== "admin"),
    save: saveLiveEdit,
    uploadImage: uploadLiveImage,
    updateSection: updateLiveSection,
  }), [adminSession?.isSuperAdmin, page, data.layoutConfig, isArabic]);

  return (
    <LiveEditContext.Provider value={liveEdit}>
    <main className={liveEdit.enabled ? "site-shell live-edit-enabled" : "site-shell"}>
      <LoadingScreen />
      <SiteScripts scripts={data.scriptsConfig} />
      <SiteBanner banner={data.bannerConfig} isArabic={isArabic} />
      <Header page={page} lang={lang} dark={dark} menuOpen={menuOpen} setMenuOpen={setMenuOpen} setLang={setLang} setDark={setDark} onBook={() => setBookingOpen(true)} config={data.headerFooterConfig} />
      <div className="route-stage">
        {page === "home" ? (
          <HomePage t={t} isArabic={isArabic} data={data} onBook={() => setBookingOpen(true)} />
        ) : page === "service-detail" && serviceSlug ? (
          <ServiceDetailIntro slug={serviceSlug} isArabic={isArabic} data={data} />
        ) : page !== "not-found" ? (
          <PageIntro page={page} t={t} isArabic={isArabic} siteText={data.siteText} />
        ) : null}

        {page === "about" ? <AboutPageLuxury data={data} isArabic={isArabic} /> : null}
        {page === "services" ? <ServicesPage data={data} isArabic={isArabic} /> : null}
        {page === "service-detail" && serviceSlug ? <ServiceDetailPage slug={serviceSlug} isArabic={isArabic} settings={settings} data={data} /> : null}
        {page === "cases" ? <CasesPageLuxury data={data} isArabic={isArabic} /> : null}
        {page === "reviews" ? <ReviewsPage data={data} review={review} setReview={setReview} submitReview={submitReview} reviewSent={reviewSent} t={t} /> : null}
        {page === "blog" && article ? <ArticleDetailPage article={article} isArabic={isArabic} builder={data.builderConfig} /> : null}
        {page === "blog" && !article ? <BlogPageLuxury data={data} isArabic={isArabic} /> : null}
        {page === "contact" ? <ContactPageLuxury booking={booking} setBooking={setBooking} submitBooking={submitBooking} t={t} isArabic={isArabic} settings={settings} bookingSent={bookingSent} formConfig={data.formConfig} /> : null}
        {page === "admin" ? <AdminPage lang={lang} t={t} /> : null}
        {page === "not-found" ? <NotFoundPage isArabic={isArabic} /> : null}
      </div>

      {page !== "admin" ? <Footer t={t} settings={settings} config={data.headerFooterConfig} /> : null}
      {page !== "admin" ? <QuickActions isArabic={isArabic} settings={settings} page={page} serviceSlug={serviceSlug} /> : null}
      {bookingOpen ? (
        <BookingModal
          booking={booking}
          setBooking={setBooking}
          submitBooking={submitBooking}
          t={t}
          isArabic={isArabic}
          onClose={() => setBookingOpen(false)}
          settings={settings}
          onSuccess={() => setBookingSent(true)}
        />
      ) : null}
    </main>
    </LiveEditContext.Provider>
  );
}

function QuickActions({ isArabic, settings, page, serviceSlug }: { isArabic: boolean; settings: SiteSettings; page: Page; serviceSlug?: ServiceSlug }) {
  function track(event: string, label: string) {
    fetch("/api/track-event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, label }) }).catch(() => null);
  }

  const contextMessage = page === "service-detail"
    ? serviceWhatsAppMessage(serviceSlug, isArabic)
    : page === "blog"
      ? (isArabic ? "مرحباً، عندي سؤال بعد قراءة مقالات عيادة Dr. Amr Elshamy." : "Hello, I have a question after reading Dr. Amr Elshamy Dental Clinic articles.")
      : page === "cases"
        ? (isArabic ? "مرحباً، عايز أستفسر عن حالات قبل وبعد في عيادة Dr. Amr Elshamy." : "Hello, I would like to ask about before and after cases at Dr. Amr Elshamy Dental Clinic.")
        : (isArabic ? "مرحباً، محتاج حجز في عيادة Dr. Amr Elshamy." : "Hello, I need an appointment at Dr. Amr Elshamy Dental Clinic.");

  return (
    <div className="quick-actions" aria-label={isArabic ? "إجراءات سريعة" : "Quick actions"}>
      <a href={`tel:${settings.phonePrimary}`} aria-label={isArabic ? "اتصال" : "Call"} onClick={() => track("phone_click", "quick_action")}>
        <Phone size={20} />
      </a>
      <a className="main-action" href={whatsappLink(contextMessage, settings.whatsappPhone)} target="_blank" rel="noreferrer" aria-label="WhatsApp" onClick={() => track("whatsapp_click", page === "service-detail" ? `service_${serviceSlug}` : "quick_action")}>
        <WhatsAppIcon size={30} />
      </a>
    </div>
  );
}

function SiteBanner({ banner, isArabic }: { banner?: BannerConfig; isArabic: boolean }) {
  if (!banner?.enabled) return null;
  return (
    <a className="site-announcement" href={banner.link || "#"} target={banner.link ? "_blank" : undefined} rel="noreferrer">
      {isArabic ? banner.textAr : banner.textEn}
    </a>
  );
}

function SiteScripts({ scripts }: { scripts?: ScriptsConfig }) {
  if (!scripts) return null;
  return (
    <>
      {scripts.googleTagManager ? <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});})(window,document,'script','dataLayer','${scripts.googleTagManager}');` }} /> : null}
      {scripts.googleAnalytics ? <script async src={`https://www.googletagmanager.com/gtag/js?id=${scripts.googleAnalytics}`} /> : null}
      {scripts.googleAnalytics ? <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${scripts.googleAnalytics}');` }} /> : null}
      {scripts.metaPixel ? <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];fbq('init','${scripts.metaPixel}');fbq('track','PageView');}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');` }} /> : null}
      {scripts.tiktokPixel ? <script dangerouslySetInnerHTML={{ __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.load=function(i){ttq._i=ttq._i||{};ttq._i[i]=[]};ttq.load('${scripts.tiktokPixel}');ttq.page();}(window,document,'ttq');` }} /> : null}
    </>
  );
}

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg className="brand-icon whatsapp-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.34.15 11.92c0 2.1.55 4.15 1.6 5.95L.05 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.58 0 11.93-5.35 11.93-11.92 0-3.18-1.24-6.18-3.5-8.42ZM12.09 21.8a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.84 9.84 0 0 1-1.51-5.27c0-5.45 4.43-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.97c0 5.45-4.44 9.89-9.9 9.89Zm5.42-7.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg className="brand-icon facebook-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.5c-1.49 0-1.95.93-1.95 1.88v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg className="brand-icon instagram-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.95 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 2a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z"
      />
    </svg>
  );
}

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg className="brand-icon tiktok-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.6 1.8c.35 2.98 2.05 4.75 4.9 4.94v3.36a8.56 8.56 0 0 1-4.8-1.5v6.54c0 5.85-6.38 8.55-10.16 4.64-3.62-3.75-1.83-10.22 3.3-11.06.88-.14 1.68-.08 2.4.12v3.62c-.35-.12-.74-.18-1.17-.17-2.7.07-3.8 3.42-1.85 5.04 1.84 1.53 4.05.18 4.05-2.23V1.8h3.33Z"
      />
    </svg>
  );
}

function ToothToggleIcon() {
  return (
    <svg className="tooth-toggle-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.1 2.2c1.25-.2 2.32.24 3.3.64.63.26 1.18.49 1.6.49s.97-.23 1.6-.49c.98-.4 2.05-.84 3.3-.64 2.42.38 4.03 2.6 3.75 5.18-.15 1.4-.74 2.5-1.3 3.56-.43.82-.84 1.59-1.01 2.43-.1.48-.16 1.07-.23 1.69-.24 2.35-.57 5.56-2.92 6.62-1.15.52-2.08-.1-2.53-1.05-.34-.72-.45-1.65-.57-2.64-.2-1.66-.43-2.72-1.09-2.72s-.9 1.06-1.09 2.72c-.12.99-.23 1.92-.57 2.64-.45.95-1.38 1.57-2.53 1.05-2.35-1.06-2.68-4.27-2.92-6.62-.07-.62-.13-1.21-.23-1.69-.17-.84-.58-1.61-1.01-2.43-.56-1.06-1.15-2.16-1.3-3.56C3.07 4.8 4.68 2.58 7.1 2.2Zm.31 2.1C6.17 4.5 5.26 5.72 5.42 7.16c.1.98.54 1.8 1.04 2.74.49.93 1.05 1.99 1.31 3.25.13.61.2 1.29.27 1.94.13 1.28.29 2.78.78 3.77.18-.48.28-1.25.37-2.03.25-2.07.65-4.76 2.81-4.76s2.56 2.69 2.81 4.76c.09.78.19 1.55.37 2.03.49-.99.65-2.49.78-3.77.07-.65.14-1.33.27-1.94.26-1.26.82-2.32 1.31-3.25.5-.94.94-1.76 1.04-2.74.16-1.44-.75-2.66-1.99-2.86-.62-.1-1.28.17-2.04.48-.82.34-1.65.68-2.55.68s-1.73-.34-2.55-.68c-.76-.31-1.42-.58-2.04-.48Z"
      />
    </svg>
  );
}

function Header({
  page,
  lang,
  dark,
  menuOpen,
  setMenuOpen,
  setLang,
  setDark,
  onBook,
  config,
}: {
  page: Page;
  lang: Lang;
  dark: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setLang: (lang: Lang) => void;
  setDark: (dark: boolean) => void;
  onBook: () => void;
  config?: HeaderFooterConfig;
}) {
  const isArabic = lang === "ar";
  const logo = config?.logo || "/brand/logo-transparent.png";
  const orderedNav = config?.navOrder?.length
    ? config.navOrder.map((pageKey) => nav.find((item) => item.page === pageKey)).filter(Boolean) as typeof nav
    : nav;
  return (
    <header className="main-header">
      <a className="brand" href="/" aria-label="Dr. Amr Elshamy Dental Clinic">
        <LiveEditableImage target={{ group: "headerFooterConfig", field: "logo", type: "image" }} className="brand-logo light-logo" src={logo} alt="Dr. Amr Elshamy logo" />
        <LiveEditableImage target={{ group: "headerFooterConfig", field: "logo", type: "image" }} className="brand-logo dark-logo" src={logo} alt="Dr. Amr Elshamy logo" />
      </a>

      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Primary navigation">
        {orderedNav.map((item) => (
          item.page === "services" ? (
            <div className="nav-mega-wrap" key={item.href}>
              <a className={page === item.page || page === "service-detail" ? "active" : ""} href={item.href} onClick={() => setMenuOpen(false)}>
                {isArabic ? item.ar : item.en}
              </a>
              <div className="mega-menu">
                {services.slice(0, 6).map((service, index) => (
                  <a href={`/services/${serviceSlugs[index]}`} key={service[0]}>
                    <img src={serviceIcons[index]} alt="" aria-hidden="true" loading="lazy" />
                    <span>{isArabic ? service[1] : service[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a className={page === item.page ? "active" : ""} key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {isArabic ? item.ar : item.en}
            </a>
          )
        ))}
      </nav>

      <div className="header-actions">
        <button className={isArabic ? "lang-switch is-ar" : "lang-switch is-en"} type="button" onClick={() => setLang(isArabic ? "en" : "ar")} aria-label="Change language" aria-pressed={!isArabic}>
          <span>AR</span>
          <span>EN</span>
          <i aria-hidden="true" />
        </button>
        <button className={dark ? "theme-switch active" : "theme-switch"} type="button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark}>
          <span className="theme-track">
            <span className="theme-state light-state">L</span>
            <span className="theme-state dark-state">D</span>
            <span className="theme-thumb">
              {dark ? "🌙" : "☀️"}
            </span>
          </span>
        </button>
        <button className="book-button" type="button" onClick={onBook}>
          <CalendarCheck size={18} />
          <span>{isArabic ? "احجز الآن" : "Book Now"}</span>
        </button>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function LoadingScreen() {
  return (
    <div className="lux-loader" aria-hidden="true">
      <div className="loader-card">
        <img src="/brand/logo-transparent.png" alt="" />
        <div className="loader-ring">
          <span />
        </div>
        <strong>Dr. Amr Elshamy</strong>
        <small>Dental Clinic</small>
        <div className="loader-progress"><span /></div>
      </div>
    </div>
  );
}

function HomePage({ t, isArabic, data, onBook }: { t: (typeof copy)[Lang]; isArabic: boolean; data: SiteData; onBook: () => void }) {
  const [serviceSlide, setServiceSlide] = useState(0);
  const [serviceDirection, setServiceDirection] = useState<"prev" | "next">("next");
  const visibleServiceCount = 4;
  const allServices = serviceListFromData(data);
  const configuredServiceIds = data.homeConfig?.serviceIds || [];
  const homeServices = configuredServiceIds.length
    ? configuredServiceIds.map((id) => allServices.find((service) => service.id === id)).filter(Boolean) as ReturnType<typeof serviceListFromData>
    : allServices.filter((service) => service.featured);
  const activeServices = homeServices.length ? homeServices : allServices;
  const featuredServices = Array.from({ length: visibleServiceCount }, (_, offset) => {
    return activeServices[(serviceSlide + offset) % activeServices.length];
  });
  const configuredReviewIds = data.homeConfig?.reviewIds || [];
  const featuredReviews = configuredReviewIds.length
    ? configuredReviewIds.map((id) => data.reviews.find((item) => item.id === id)).filter(Boolean) as Review[]
    : data.reviews.slice(0, 4);
  const hero = data.heroConfig || {};
  const siteText = data.siteText || {};
  const siteCopy = (key: string, fallback: string) => String(siteText[key] || fallback);
  const hiddenSections = new Set(data.layoutConfig?.hiddenSections || []);
  const isHidden = (key: string) => hiddenSections.has(key);
  const defaultSectionOrder = ["hero", "stats", "trust", "implant", "journey", "quiz", "preview", "comfort", "services", "reviews"];
  const configuredSectionOrder = data.layoutConfig?.sections?.length ? data.layoutConfig.sections : defaultSectionOrder;
  const sectionOrder = [...configuredSectionOrder, ...defaultSectionOrder.filter((key) => !configuredSectionOrder.includes(key))];
  const moveServices = (direction: "prev" | "next") => {
    setServiceDirection(direction);
    setServiceSlide((current) => (current + (direction === "next" ? 1 : activeServices.length - 1)) % activeServices.length);
  };

  const renderHomeSection = (key: string) => {
    if (isHidden(key)) return null;
    if (key === "hero") {
      return (
        <EditableSection id={key} label={isArabic ? "الهيرو" : "Hero"} key={key}>
        <section className="hero-section">
          <LiveEditableImage target={{ group: "heroConfig", field: "teethImage", type: "image" }} className="hero-teeth-shape" src={hero.teethImage || "/brand/dental-implant-cutout.png"} alt="" decorative />
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={16} /> <EditableText as="span" target={{ group: "heroConfig", field: isArabic ? "badgeAr" : "badgeEn" }}>{isArabic ? (hero.badgeAr || t.badge) : (hero.badgeEn || t.badge)}</EditableText></p>
            <EditableText as="h1" target={{ group: "heroConfig", field: isArabic ? "titleAr" : "titleEn" }}>{isArabic ? (hero.titleAr || t.title) : (hero.titleEn || t.title)}</EditableText>
            <p className="lead">
              <EditableText as="span" target={{ group: "heroConfig", field: isArabic ? "subtitleAr" : "subtitleEn" }}>
                {isArabic ? (hero.subtitleAr || "في عيادة Dr. Amr Elshamy بنهتم براحتك من أول رسالة واتساب لحد نتيجة العلاج. خدمات أسنان للكبار والأطفال بأسلوب بسيط وودود.") : (hero.subtitleEn || "At Dr. Amr Elshamy Dental Clinic, booking is simple, care is gentle, and every treatment plan is explained clearly for adults and children.")}
              </EditableText>
            </p>
            <div className="hero-buttons">
              <button className="primary-button" type="button" onClick={onBook}><CalendarCheck size={18} /> <EditableText as="button-label" target={{ group: "heroConfig", field: isArabic ? "primaryCtaAr" : "primaryCtaEn" }}>{isArabic ? (hero.primaryCtaAr || t.book) : (hero.primaryCtaEn || t.book)}</EditableText></button>
              <a className="secondary-button" href="/services"><EditableText as="button-label" target={{ group: "heroConfig", field: isArabic ? "secondaryCtaAr" : "secondaryCtaEn" }}>{isArabic ? (hero.secondaryCtaAr || t.servicesCta) : (hero.secondaryCtaEn || t.servicesCta)}</EditableText> <ChevronRight size={18} /></a>
            </div>
            <div className="hero-trust-pills">
              <span><Star size={15} fill="currentColor" /> 5.0</span>
              <span><ShieldCheck size={15} /> {isArabic ? "تعقيم" : "Sterile"}</span>
              <span><UsersRound size={15} /> {isArabic ? "كبار وأطفال" : "Adults & Kids"}</span>
            </div>
          </div>

          <div className="hero-media" aria-label="Dr. Amr Elshamy portrait">
            <div className="gold-disc" />
            <LiveEditableImage target={{ group: "heroConfig", field: "doctorImage", type: "image" }} src={hero.doctorImage || "/brand/dr-amr-hero-premium.png"} alt="Dr. Amr Elshamy" />
            <div className="floating-card rating-card">
              <Star size={28} fill="currentColor" />
              <strong>5-Star</strong>
              <span>{t.rating}</span>
            </div>
          </div>
        </section>
        </EditableSection>
      );
    }
    if (key === "stats") return <EditableSection id={key} label={isArabic ? "الإحصائيات" : "Stats"} key={key}><Stats t={t} hero={hero} /></EditableSection>;
    if (key === "trust") return <EditableSection id={key} label={isArabic ? "الثقة" : "Trust"} key={key}><TrustBar isArabic={isArabic} builder={data.builderConfig} /></EditableSection>;
    if (key === "implant") return <EditableSection id={key} label={isArabic ? "الزراعة" : "Implant"} key={key}><ImplantVisualFeature isArabic={isArabic} onBook={onBook} builder={data.builderConfig} /></EditableSection>;
    if (key === "journey") return <EditableSection id={key} label={isArabic ? "رحلة العلاج" : "Journey"} key={key}><SmileJourney isArabic={isArabic} builder={data.builderConfig} /></EditableSection>;
    if (key === "quiz") return <EditableSection id={key} label={isArabic ? "اختبار الحجز" : "Quiz"} key={key}><QuickConsultQuiz isArabic={isArabic} builder={data.builderConfig} /></EditableSection>;
    if (key === "preview") return <EditableSection id={key} label={isArabic ? "معاينة الابتسامة" : "Preview"} key={key}><SmilePreviewCta isArabic={isArabic} builder={data.builderConfig} /></EditableSection>;
    if (key === "comfort") return <EditableSection id={key} label={isArabic ? "راحة المرضى" : "Comfort"} key={key}><PatientComfortSection isArabic={isArabic} siteText={siteText} builder={data.builderConfig} /></EditableSection>;
    if (key === "services") {
      return (
        <EditableSection id={key} label={isArabic ? "الخدمات" : "Services"} key={key}>
        <section className="home-showcase" id="services-preview">
          <p className="section-label"><EditableText as="span" target={{ group: "siteText", field: isArabic ? "servicesLabelAr" : "servicesLabelEn" }}>{siteCopy(isArabic ? "servicesLabelAr" : "servicesLabelEn", isArabic ? "خدماتنا" : "Our Services")}</EditableText></p>
          <EditableText as="h2" target={{ group: "siteText", field: isArabic ? "servicesTitleAr" : "servicesTitleEn" }}>{siteCopy(isArabic ? "servicesTitleAr" : "servicesTitleEn", t.pages.services[1])}</EditableText>
          <p className="section-text"><EditableText as="span" target={{ group: "siteText", field: isArabic ? "servicesTextAr" : "servicesTextEn" }}>{siteCopy(isArabic ? "servicesTextAr" : "servicesTextEn", t.pages.services[2])}</EditableText></p>
          <div className="showcase-frame">
            <button className="round-arrow prev-arrow" type="button" aria-label={isArabic ? "الخدمات السابقة" : "Previous services"} onClick={() => moveServices("prev")}>
              <ArrowRight size={24} strokeWidth={2.6} aria-hidden="true" />
            </button>
            <div className={`service-grid home-service-grid slide-${serviceDirection}`}>
              {featuredServices.map((service, offset) => (
                <article className="service-card" key={`${service.slug}-${serviceSlide}-${offset}`} style={{ "--card-delay": `${offset * 70}ms` } as CSSProperties}>
                  {renderServiceVisual(service.icon)}
                  <h3>{isArabic ? service.titleAr : service.titleEn}</h3>
                  <p>{isArabic ? service.descriptionAr : service.descriptionEn}</p>
                  <a href={`/services/${service.slug}`}>{isArabic ? "اعرف أكثر" : "Learn More"} <ChevronRight size={16} /></a>
                </article>
              ))}
            </div>
            <button className="round-arrow next-arrow" type="button" aria-label={isArabic ? "الخدمات التالية" : "Next services"} onClick={() => moveServices("next")}>
              <ArrowLeft size={24} strokeWidth={2.6} aria-hidden="true" />
            </button>
          </div>
        </section>
        </EditableSection>
      );
    }
    if (key === "reviews") {
      return (
        <EditableSection id={key} label={isArabic ? "آراء المرضى" : "Reviews"} key={key}>
        <section className="home-showcase reviews-showcase" id="reviews-preview">
          <p className="section-label"><EditableText as="span" target={{ group: "siteText", field: isArabic ? "reviewsLabelAr" : "reviewsLabelEn" }}>{siteCopy(isArabic ? "reviewsLabelAr" : "reviewsLabelEn", isArabic ? "آراء المرضى" : "Testimonials")}</EditableText></p>
          <EditableText as="h2" target={{ group: "siteText", field: isArabic ? "reviewsTitleAr" : "reviewsTitleEn" }}>{siteCopy(isArabic ? "reviewsTitleAr" : "reviewsTitleEn", t.pages.reviews[1])}</EditableText>
          <p className="section-text">
            <EditableText as="span" target={{ group: "siteText", field: isArabic ? "reviewsTextAr" : "reviewsTextEn" }}>{siteCopy(isArabic ? "reviewsTextAr" : "reviewsTextEn", isArabic ? "مختارات حقيقية من آراء المرضى، وتقدر تشوف باقي التجارب كاملة في صفحة آراء المرضى." : "Real patient highlights from the reviews page. Open the full page to explore more experiences.")}</EditableText>
          </p>
          <div className="review-grid home-review-grid">
            {featuredReviews.map((item) => (
              <article className="review-card" key={item.id}>
                <span className="stars">{"★".repeat(item.rating)}</span>
                <p>{item.message}</p>
                <div className="review-author">
                  <img src="/icons/comfort-face.png" alt="" aria-hidden="true" loading="lazy" />
                  <strong>{item.name}</strong>
                  <span className="google-badge" aria-label="Google verified review">G</span>
                </div>
              </article>
            ))}
          </div>
          <div className="home-review-actions">
            <a className="secondary-button" href="/reviews">
              <EditableText as="button-label" target={{ group: "siteText", field: isArabic ? "reviewsButtonAr" : "reviewsButtonEn" }}>{siteCopy(isArabic ? "reviewsButtonAr" : "reviewsButtonEn", isArabic ? "شوف باقي آراء المرضى" : "See More Patient Reviews")}</EditableText> <ChevronRight size={18} />
            </a>
          </div>
        </section>
        </EditableSection>
      );
    }
    return null;
  };

  return <>{sectionOrder.map((key) => renderHomeSection(key))}</>;
}

function PageIntro({ page, t, isArabic, siteText = {} }: { page: Page; t: (typeof copy)[Lang]; isArabic: boolean; siteText?: Record<string, string> }) {
  if (page === "home") return null;
  const pageCopy = t.pages[page];
  const keyPrefix = `page${page.charAt(0).toUpperCase()}${page.slice(1)}`;
  const langSuffix = isArabic ? "Ar" : "En";
  const label = String(siteText[`${keyPrefix}Label${langSuffix}`] || pageCopy[0]);
  const title = String(siteText[`${keyPrefix}Title${langSuffix}`] || pageCopy[1]);
  const description = String(siteText[`${keyPrefix}Text${langSuffix}`] || pageCopy[2]);
  return (
    <section className="page-hero">
      <div className="intro-mark" aria-hidden="true">
        <ToothToggleIcon />
      </div>
      <p className="section-label">{label}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

function EditableText({ target, children, className, as = "span" }: { target: LiveEditTarget; children: ReactNode; className?: string; as?: "span" | "p" | "h1" | "h2" | "h3" | "strong" | "button-label" }) {
  const live = useContext(LiveEditContext);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const Tag = as === "button-label" ? "span" : as;

  useEffect(() => {
    setValue(typeof children === "string" ? children : "");
  }, [children]);

  async function save() {
    if (!editing) return;
    setEditing(false);
    if (value.trim()) await live.save(target, value);
  }

  if (!live.enabled) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className ? `${className} live-edit-text` : "live-edit-text"}
      contentEditable={editing}
      suppressContentEditableWarning
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
      }}
      onInput={(event) => setValue(event.currentTarget.textContent || "")}
      onBlur={() => void save()}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          void save();
        }
      }}
      data-live-edit="text"
    >
      {editing ? value : children}
      <Edit3 className="live-edit-pencil" size={15} aria-hidden="true" />
    </Tag>
  );
}

function LiveEditableImage({ target, src, alt, className, loading, decorative }: { target: LiveEditTarget; src: string; alt: string; className?: string; loading?: "lazy" | "eager"; decorative?: boolean }) {
  const live = useContext(LiveEditContext);

  async function pick(file: File | undefined) {
    const url = await live.uploadImage(file);
    if (url) await live.save({ ...target, type: "image" }, url);
  }

  if (!live.enabled) return <img className={className} src={src} alt={alt} loading={loading} aria-hidden={decorative ? "true" : undefined} />;

  return (
    <label className="live-edit-image" data-live-edit="image">
      <img className={className} src={src} alt={alt} loading={loading} aria-hidden={decorative ? "true" : undefined} />
      <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void pick(event.target.files?.[0])} />
      <span><ImageIcon size={15} /> تغيير</span>
    </label>
  );
}

function EditableSection({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const live = useContext(LiveEditContext);
  if (!live.enabled) return <>{children}</>;

  return (
    <div className="live-edit-section" data-section={id}>
      <div className="live-section-toolbar" onClick={(event) => event.stopPropagation()}>
        <strong>{label}</strong>
        <button type="button" aria-label="Move section up" onClick={() => void live.updateSection(id, "up")}>↑</button>
        <button type="button" aria-label="Move section down" onClick={() => void live.updateSection(id, "down")}>↓</button>
        <button type="button" aria-label="Hide section" onClick={() => void live.updateSection(id, "hide")}><EyeOff size={15} /></button>
      </div>
      {children}
    </div>
  );
}

function Stats({ t, hero }: { t: (typeof copy)[Lang]; hero?: HeroConfig }) {
  const stats = [
    [hero?.metric1 || t.stats[0][0], t.stats[0][1], t.stats[0][2]],
    [hero?.metric2 || t.stats[1][0], t.stats[1][1], t.stats[1][2]],
    [hero?.metric3 || t.stats[2][0], t.stats[2][1], t.stats[2][2]],
  ];
  return (
    <section className="stats-row" aria-label="Clinic highlights">
      {stats.map((item, index) => (
        <div className="stat-item" key={item[1]}>
          <img className="metric-icon-3d" src={metricIcons[index]} alt="" aria-hidden="true" loading="lazy" />
          <div>
            <strong><AnimatedStatNumber value={item[0]} /></strong>
            <span>{item[1]}</span>
            <small>{item[2]}</small>
          </div>
        </div>
      ))}
    </section>
  );
}

function AnimatedStatNumber({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setCount(target);
      return;
    }

    let frame = 0;
    const duration = 2800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <>{count}{suffix}</>;
}

function TrustBar({ isArabic, builder }: { isArabic: boolean; builder?: BuilderConfig }) {
  const fallbackItems: BuilderCard[] = [
    { icon: "whatsapp", ar: "حجز واتساب سريع", en: "Fast WhatsApp booking" },
    { icon: "shield", ar: "تعقيم وراحة", en: "Sterilization & comfort" },
    { icon: "smile", ar: "تجميل وأسنان عامة", en: "Cosmetic & general dentistry" },
    { icon: "users", ar: "مناسب للكبار والأطفال", en: "Adults and kids friendly" },
  ];
  const items = enabledItems(builder?.trustItems, fallbackItems);

  return (
    <section className="trust-bar" aria-label="Clinic trust highlights">
      {items.map((item, index) => (
        <span key={`${item.icon || "trust"}-${index}`}>
          {builderIcon(item.icon, 18)}
          {localizedPair(item, isArabic)}
        </span>
      ))}
    </section>
  );
}

function ImplantVisualFeature({ isArabic, onBook, builder }: { isArabic: boolean; onBook: () => void; builder?: BuilderConfig }) {
  const section = builder?.implantSection || {};
  return (
    <section className="implant-visual-feature">
      <div className="implant-visual-copy">
        <p className="section-label">{isArabic ? (section.labelAr || "تصميم مستوحى من تقنيات الزراعة") : (section.labelEn || "Implantology Visual System")}</p>
        <h2>{isArabic ? (section.titleAr || "تفاصيل ثلاثية الأبعاد تشرح الزراعة بشكل راقي") : (section.titleEn || "Premium 3D detail for clear implant care")}</h2>
        <p>
          {isArabic
            ? (section.textAr || "أضفنا عنصر أسنان ثلاثي الأبعاد بروح تصميمات الزراعة الحديثة، مع الحفاظ على هوية العيادة الذهبية والفحمية.")
            : (section.textEn || "A refined 3D dental implant visual brings modern implantology clarity while keeping the clinic gold and charcoal identity.")}
        </p>
        <div className="implant-feature-actions">
          <button className="primary-button" type="button" onClick={onBook}><CalendarCheck size={18} /> {isArabic ? (section.buttonAr || "احجز استشارة زراعة") : (section.buttonEn || "Book Implant Consultation")}</button>
          <a className="secondary-button" href="/services/dental-implants">{isArabic ? (section.linkTextAr || "تفاصيل زراعة الأسنان") : (section.linkTextEn || "Dental Implant Details")} <ChevronRight size={18} /></a>
        </div>
      </div>
      <div className="implant-visual-art">
        <img src={section.image || "/brand/dentax-inspired-teeth.png"} alt={isArabic ? "شكل ثلاثي الأبعاد لزراعة الأسنان" : "3D dental implant visual"} loading="lazy" />
      </div>
    </section>
  );
}

function SmileJourney({ isArabic, builder }: { isArabic: boolean; builder?: BuilderConfig }) {
  const [active, setActive] = useState(0);
  const steps = enabledItems(builder?.journeySteps, journeySteps.map((step, index) => ({
    key: step[0],
    titleAr: step[1],
    titleEn: step[0],
    textAr: step[2],
    textEn: step[3],
    icon: ["whatsapp", "search", "plan", "treatment", "follow"][index],
  })));
  const activeIndex = Math.min(active, Math.max(steps.length - 1, 0));
  const activeStep = steps[activeIndex] || steps[0];
  const labels = [
    isArabic ? "رحلة الابتسامة" : "Smile Journey",
    isArabic ? "من أول رسالة واتساب لحد المتابعة" : "From First WhatsApp Message to Follow-up",
    isArabic ? "خطوات واضحة تخلي المريض فاهم ومطمن قبل كل مرحلة." : "A clear patient journey that keeps every step simple and reassuring.",
  ];

  return (
    <section className="creative-section journey-section">
      <div className="creative-head">
        <p className="section-label">{labels[0]}</p>
        <h2>{labels[1]}</h2>
        <p>{labels[2]}</p>
      </div>
      <div className="journey-timeline">
        {steps.map((step, index) => (
          <button className={activeIndex === index ? "journey-step active" : "journey-step"} type="button" key={step.key || step.titleEn || index} onClick={() => setActive(index)}>
            <span>{builderIcon(step.icon, 20)}</span>
            <strong>{isArabic ? step.titleAr : step.titleEn}</strong>
          </button>
        ))}
      </div>
      {activeStep ? <article className={activeIndex === 0 ? "journey-detail whatsapp-detail" : "journey-detail"}>
        <div className={activeIndex === 0 ? "journey-whatsapp-icon journey-detail-icon" : "journey-detail-icon"} aria-hidden="true">
          {builderIcon(activeStep.icon, 20)}
        </div>
        <div>
          <strong>{isArabic ? activeStep.titleAr : activeStep.titleEn}</strong>
          <p>{isArabic ? activeStep.textAr : activeStep.textEn}</p>
        </div>
      </article> : null}
    </section>
  );
}

function QuickConsultQuiz({ isArabic, builder }: { isArabic: boolean; builder?: BuilderConfig }) {
  const options = enabledItems(builder?.quizOptions, quizOptions.map((option) => ({
    key: option[0],
    labelAr: option[1],
    labelEn: option[2],
    messageAr: option[3],
    messageEn: option[2],
  })));
  const [issue, setIssue] = useState(options[0]?.key || "pain");
  const [patient, setPatient] = useState(isArabic ? "بالغ" : "Adult");
  const [priority, setPriority] = useState(isArabic ? "أقرب موعد مناسب" : "Nearest suitable appointment");
  const selected = options.find((item) => item.key === issue) || options[0];
  const message = isArabic
    ? `مرحباً، محتاج حجز في عيادة Dr. Amr Elshamy.\nالمشكلة: ${selected?.messageAr || selected?.labelAr || ""}\nالمريض: ${patient}\nالأولوية: ${priority}`
    : `Hello, I need an appointment at Dr. Amr Elshamy Dental Clinic.\nConcern: ${selected?.messageEn || selected?.labelEn || ""}\nPatient: ${patient}\nPriority: ${priority}`;

  return (
    <section className="creative-section quiz-section">
      <div className="creative-head">
        <p className="section-label">{isArabic ? "اختبار سريع قبل الحجز" : "Quick Pre-booking Check"}</p>
        <h2>{isArabic ? "مشكلتك إيه؟ نجهز رسالة الحجز فوراً" : "What is your concern? We prepare the booking message"}</h2>
      </div>
      <div className="quiz-card">
        <div className="quiz-options">
          {options.map((option) => (
            <button className={issue === option.key ? "active" : ""} type="button" key={option.key} onClick={() => setIssue(option.key || "")}>
              {isArabic ? option.labelAr : option.labelEn}
            </button>
          ))}
        </div>
        <div className="quiz-fields">
          <select value={patient} onChange={(event) => setPatient(event.target.value)}>
            <option>{isArabic ? "بالغ" : "Adult"}</option>
            <option>{isArabic ? "طفل" : "Child"}</option>
          </select>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option>{isArabic ? "أقرب موعد مناسب" : "Nearest suitable appointment"}</option>
            <option>{isArabic ? "استشارة فقط" : "Consultation only"}</option>
            <option>{isArabic ? "حالة ألم" : "Pain case"}</option>
          </select>
          <a className="primary-button" href={whatsappLink(message)} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={18} />
            {isArabic ? "افتح واتساب بالرسالة" : "Open WhatsApp Message"}
          </a>
        </div>
      </div>
    </section>
  );
}

function SmilePreviewCta({ isArabic, builder }: { isArabic: boolean; builder?: BuilderConfig }) {
  const [name, setName] = useState("");
  const [problem, setProblem] = useState("");
  const [fileName, setFileName] = useState("");
  const section = builder?.previewSection || {};
  const message = isArabic
    ? `مرحباً، عايز أعرف أنسب حل لابتسامتي.\nالاسم: ${name || "-"}\nالمشكلة: ${problem || "-"}${fileName ? `\nعندي صورة باسم: ${fileName} وهرفعها في المحادثة.` : ""}`
    : `Hello, I would like to know the best solution for my smile.\nName: ${name || "-"}\nConcern: ${problem || "-"}${fileName ? `\nI have a photo named: ${fileName} and will upload it in the chat.` : ""}`;

  return (
    <section className="smile-preview">
      <div>
        <p className="section-label">{isArabic ? (section.labelAr || "Smile Preview") : (section.labelEn || "Smile Preview")}</p>
        <h2>{isArabic ? (section.titleAr || "عايز تعرف أنسب حل لابتسامتك؟") : (section.titleEn || "Want to know the right smile solution?")}</h2>
        <p>{isArabic ? (section.textAr || "اكتب المشكلة، ولو عندك صورة ارفعها بعد فتح واتساب.") : (section.textEn || "Write the concern, and upload a photo after WhatsApp opens.")}</p>
      </div>
      <form className="preview-form">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder={isArabic ? (section.namePlaceholderAr || "اسمك") : (section.namePlaceholderEn || "Your name")} />
        <textarea value={problem} onChange={(event) => setProblem(event.target.value)} placeholder={isArabic ? (section.problemPlaceholderAr || "إيه اللي حابب تغيره في ابتسامتك؟") : (section.problemPlaceholderEn || "What would you like to improve?")} />
        <input type="file" accept="image/*" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} />
        <a className="primary-button" href={whatsappLink(message)} target="_blank" rel="noreferrer">
          <WhatsAppIcon size={18} />
          {isArabic ? (section.buttonAr || "إرسال على واتساب") : (section.buttonEn || "Send via WhatsApp")}
        </a>
      </form>
    </section>
  );
}

function PatientComfortSection({ isArabic, siteText = {}, builder }: { isArabic: boolean; siteText?: Record<string, string>; builder?: BuilderConfig }) {
  const siteCopy = (key: string, fallback: string) => String(siteText[key] || fallback);
  const items = enabledItems(builder?.comfortItems, comfortItems.map((item) => ({
    ar: item[0],
    en: item[1],
    textAr: item[2],
    textEn: item[2],
    image: item[3],
  })));
  return (
    <section className="creative-section comfort-section trust-choice-section">
      <div className="creative-head">
        <p className="section-label">{siteCopy(isArabic ? "trustLabelAr" : "trustLabelEn", isArabic ? "ليه تختار العيادة؟" : "Why Choose the Clinic?")}</p>
        <h2>{siteCopy(isArabic ? "trustTitleAr" : "trustTitleEn", isArabic ? "ثقة مبنية على وضوح وراحة ومتابعة" : "Trust Built on Clarity, Comfort, and Follow-up")}</h2>
        <p>{siteCopy(isArabic ? "trustTextAr" : "trustTextEn", isArabic ? "التجربة مش علاج بس؛ المهم إنك تفهم حالتك وتدخل كل خطوة وأنت مطمئن." : "Care is not only treatment; it is understanding your case and feeling confident at every step.")}</p>
      </div>
      <div className="comfort-grid">
        {items.map((item, index) => (
          <article key={`${item.ar || item.en}-${index}`}>
            <img src={item.image || "/icons/comfort-face.png"} alt="" aria-hidden="true" loading="lazy" />
            <strong>{localizedPair(item, isArabic)}</strong>
            <p>{isArabic ? (item.textAr || "") : (item.textEn || item.textAr || "")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutPage({ isArabic }: { isArabic: boolean }) {
  return (
    <section className="split-section page-content">
      <div className="about-photo-panel">
        <img src="/brand/dr-amr.jpg" alt="Dr. Amr Elshamy" />
      </div>
      <div>
        <h2>{isArabic ? "تجربة علاج مريحة وواضحة" : "Clear, Comfortable Dental Care"}</h2>
        <p>
          {isArabic
            ? "دكتور عمرو الشامي هو صاحب العيادة، والهدف إن كل مريض يدخل وهو مطمن، يفهم حالته، يعرف الخيارات المتاحة، ويحصل على نتيجة مناسبة بدون توتر."
            : "Dr. Amr Elshamy owns the clinic and focuses on helping every patient feel comfortable, understand the case, and choose the right treatment plan without stress."}
        </p>
        <div className="about-points">
          <span><UsersRound size={18} /> {isArabic ? "خدمات للكبار والأطفال" : "Adults and children"}</span>
          <span><WhatsAppIcon size={18} /> {isArabic ? "حجز سريع عبر واتساب" : "Fast WhatsApp booking"}</span>
          <span><ClipboardCheck size={18} /> {isArabic ? "تعامل ودود وخطة واضحة" : "Friendly care and clear plans"}</span>
          <span><ShieldCheck size={18} /> {isArabic ? "اهتمام بالتعقيم وراحة المريض" : "Focused on hygiene and patient comfort"}</span>
        </div>
      </div>
    </section>
  );
}

function ServicesPage({ data, isArabic }: { data: SiteData; isArabic: boolean }) {
  const visibleServices = serviceListFromData(data);
  const faqs = (data.faq || []).filter((item) => item.page === "services" || item.page === "all");
  return (
    <section className="section-block page-content">
      <div className="premium-strip">
        <span><ClipboardCheck size={16} /> {isArabic ? "خطة واضحة" : "Clear plan"}</span>
        <span><WhatsAppIcon size={16} /> {isArabic ? "حجز واتساب" : "WhatsApp booking"}</span>
        <span><Baby size={16} /> {isArabic ? "للكبار والأطفال" : "Adults and children"}</span>
      </div>
      <div className="service-grid">
        {visibleServices.map((service) => (
          <article className="service-card" key={service.slug}>
            {renderServiceVisual(service.icon)}
            <h3>{isArabic ? service.titleAr : service.titleEn}</h3>
            <p>{isArabic ? service.descriptionAr : service.descriptionEn}</p>
            <a href={`/services/${service.slug}`}>{isArabic ? "اعرف أكثر" : "Learn More"}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function CasesPage({ data, isArabic }: { data: SiteData; isArabic: boolean }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <section className="section-block page-content">
      <div className="premium-case-grid">
        {cases.map((item) => (
          <PremiumCaseCard caseItem={item} isArabic={isArabic} onOpen={() => setSelected(item)} key={item.id} />
        ))}
      </div>
      {selected ? (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <button className="close-button" type="button" aria-label="Close image"><X size={22} /></button>
          <img src={parseCase(selected).afterImage} alt={selected.title} loading="lazy" />
          <strong>{isArabic && selected.title.startsWith("Case") ? `حالة ${selected.id}` : selected.title}</strong>
        </div>
      ) : null}
    </section>
  );
}

function ReviewsPage({
  data,
  review,
  setReview,
  submitReview,
  reviewSent,
  t,
}: {
  data: SiteData;
  review: { name: string; rating: number; message: string };
  setReview: (review: { name: string; rating: number; message: string }) => void;
  submitReview: (event: FormEvent<HTMLFormElement>) => void;
  reviewSent: boolean;
  t: (typeof copy)[Lang];
}) {
  const [reviewPage, setReviewPage] = useState(1);
  const [activeReviewShot, setActiveReviewShot] = useState<number | null>(null);
  const reviewPages = Math.ceil(reviewScreenshotCount / reviewScreenshotsPerPage);
  const pageStart = (reviewPage - 1) * reviewScreenshotsPerPage;
  const visibleReviewShots = Array.from({ length: reviewScreenshotsPerPage }, (_, index) => pageStart + index + 1).filter(
    (shotNumber) => shotNumber <= reviewScreenshotCount,
  );

  const goToReviewPage = (page: number) => {
    setReviewPage(Math.min(Math.max(page, 1), reviewPages));
    setActiveReviewShot(null);
  };

  return (
    <section
      className="section-block page-content"
      onClick={(event) => {
        if (activeReviewShot && !(event.target as Element).closest(".review-shot")) {
          setActiveReviewShot(null);
        }
      }}
    >
      <div className={`review-screenshot-strip${activeReviewShot ? " has-expanded-review" : ""}`}>
        {visibleReviewShots.map((shotNumber) => (
          <button
            className={`review-shot${activeReviewShot === shotNumber ? " is-expanded" : ""}`}
            key={shotNumber}
            type="button"
            onClick={() => setActiveReviewShot(activeReviewShot === shotNumber ? null : shotNumber)}
            onMouseLeave={() => {
              if (activeReviewShot === shotNumber) {
                setActiveReviewShot(null);
              }
            }}
            aria-pressed={activeReviewShot === shotNumber}
            aria-label={`Highlight patient review screenshot ${shotNumber}`}
          >
            <img
              src={`/reviews/review-${String(shotNumber).padStart(3, "0")}.jpg`}
              alt={`Patient review screenshot ${shotNumber}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>
      <div className="review-shot-pagination" aria-label="Patient review pages">
        <button type="button" onClick={() => goToReviewPage(reviewPage - 1)} disabled={reviewPage === 1}>
          {t.dir === "rtl" ? "السابق" : "Prev"}
        </button>
        {Array.from({ length: reviewPages }, (_, index) => index + 1).map((page) => (
          <button
            className={page === reviewPage ? "is-active" : ""}
            type="button"
            onClick={() => goToReviewPage(page)}
            aria-current={page === reviewPage ? "page" : undefined}
            key={page}
          >
            {page}
          </button>
        ))}
        <button type="button" onClick={() => goToReviewPage(reviewPage + 1)} disabled={reviewPage === reviewPages}>
          {t.dir === "rtl" ? "التالي" : "Next"}
        </button>
      </div>
      <div className="review-grid">
        {data.reviews.map((item) => (
          <article className="review-card" key={item.id}>
            <span className="stars">{"★".repeat(item.rating)}</span>
            <p>{item.message}</p>
            <strong>{item.name}</strong>
          </article>
        ))}
      </div>
      <form className="review-form" onSubmit={submitReview}>
        <h3>{t.addReview}</h3>
        <input required value={review.name} onChange={(event) => setReview({ ...review, name: event.target.value })} placeholder={t.formName} />
        <select value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}>
          {[5, 4, 3, 2, 1].map((rating) => <option value={rating} key={rating}>{rating} ★</option>)}
        </select>
        <textarea required value={review.message} onChange={(event) => setReview({ ...review, message: event.target.value })} placeholder={t.formMessage} />
        <button className="primary-button" type="submit">{t.save}</button>
        <small className={reviewSent ? "success-message" : ""}>
          {reviewSent ? (t.dir === "rtl" ? "تم إرسال رأيك بنجاح وسيظهر بعد موافقة الأدمن." : "Your review was sent successfully and will appear after admin approval.") : t.reviewHint}
        </small>
      </form>
    </section>
  );
}

function BlogPage({ data, isArabic }: { data: SiteData; isArabic: boolean }) {
  return (
    <section className="section-block page-content">
      <div className="article-grid blog-grid">
        {data.articles.map((article) => (
          <article className="article-card" key={article.id}>
            <small>{isArabic ? "مقالة" : "Article"}</small>
            <h3>{article.title}</h3>
            <p>{isArabic ? (article.excerpt_ar || article.meta_description || article.body) : (article.excerpt_en || article.excerpt_ar || article.meta_description || article.body)}</p>
            <strong>{article.conclusion}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactPage({
  booking,
  setBooking,
  submitBooking,
  t,
  isArabic,
}: {
  booking: { name: string; phone: string; service: string; message: string };
  setBooking: (booking: { name: string; phone: string; service: string; message: string }) => void;
  submitBooking: (event: FormEvent<HTMLFormElement>) => void;
  t: (typeof copy)[Lang];
  isArabic: boolean;
}) {
  return (
    <section className="contact-section page-content">
      <div className="contact-card">
        <h2>{t.pages.contact[1]}</h2>
        <p className="section-text">{t.pages.contact[2]}</p>
        <div className="contact-links">
          <a href={`tel:+${whatsappPrimary}`}><Phone size={18} /> <span className="phone-number">+20 10 90460873</span></a>
          <a href={`tel:${whatsappSecondary}`}><Phone size={18} /> <span className="phone-number">{whatsappSecondary}</span></a>
          <a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> {t.address}</a>
        </div>
      </div>
      <form className="booking-form" onSubmit={submitBooking}>
        <input required value={booking.name} onChange={(event) => setBooking({ ...booking, name: event.target.value })} placeholder={t.formName} />
        <input value={booking.phone} onChange={(event) => setBooking({ ...booking, phone: event.target.value })} placeholder={t.formPhone} />
        <select value={booking.service} onChange={(event) => setBooking({ ...booking, service: event.target.value })}>
          <option value="">{t.formService}</option>
          {services.map((service) => <option value={isArabic ? service[1] : service[0]} key={service[0]}>{isArabic ? service[1] : service[0]}</option>)}
        </select>
        <textarea value={booking.message} onChange={(event) => setBooking({ ...booking, message: event.target.value })} placeholder={t.formMessage} />
        <button className="primary-button" type="submit"><WhatsAppIcon size={18} /> {t.sendWhatsApp}</button>
      </form>
    </section>
  );
}

function AboutPageLuxury({ data, isArabic }: { data: SiteData; isArabic: boolean }) {
  const profile = data.doctorProfile || {};
  const tourImages = enabledItems(data.builderConfig?.clinicTour, clinicTour.map((image) => ({ image, enabled: true })));
  return (
    <>
      <section className="about-editorial page-content">
        <div className="about-photo-panel">
          <img src={profile.imageUrl || "/brand/dr-amr.jpg"} alt={profile.nameEn || "Dr. Amr Elshamy"} />
        </div>
        <div className="about-story">
          <p className="section-label">Luxury Medical Care</p>
          <h2>{isArabic ? (profile.titleAr || "تجربة علاج مريحة وواضحة بمعايير عيادة فاخرة") : (profile.titleEn || "Clear, Comfortable Dental Care With a Luxury Clinic Standard")}</h2>
          <p>
            {isArabic
              ? (profile.bioAr || "دكتور عمرو الشامي هو صاحب العيادة، والهدف إن كل مريض يدخل وهو مطمن، يفهم حالته وخطة العلاج، ويحصل على نتيجة صحية وجمالية بدون توتر.")
              : (profile.bioEn || "Dr. Amr Elshamy owns the clinic and focuses on helping every patient feel comfortable, understand the case, and choose the right treatment plan without stress.")}
          </p>
          <div className="credential-grid">
            {[
              [<SmilePlus size={18} key="cosmetic" />, isArabic ? "رعاية تجميلية" : "Cosmetic Care", isArabic ? "ابتسامة طبيعية بتفاصيل دقيقة" : "Natural smiles with precise detail"],
              [<ShieldCheck size={18} key="sterile" />, isArabic ? "تعقيم متقدم" : "Advanced Sterilization", isArabic ? "مسار نظافة واضح في كل زيارة" : "A clear hygiene flow for every visit"],
              [<ClipboardCheck size={18} key="plan" />, isArabic ? "خطة علاج" : "Treatment Planning", isArabic ? "شرح بسيط وخيارات مناسبة" : "Simple explanation and suitable options"],
            ].map((item) => (
              <article key={String(item[1])}>
                {item[0]}
                <strong>{item[1]}</strong>
                <span>{item[2]}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="tour-section">
        <p className="section-label">{isArabic ? "جولة داخل العيادة" : "Clinic Virtual Tour"}</p>
        <h2>{isArabic ? "مساحة علاج هادئة، نظيفة، وفاخرة" : "A Calm, Sterile, Premium Treatment Space"}</h2>
        <div className="tour-grid">
          {tourImages.map((item, index) => (
            <button className="tour-card" type="button" key={item.image || index}>
              <img src={item.image || clinicTour[index % clinicTour.length]} alt={(isArabic ? item.altAr : item.altEn) || `Clinic tour ${index + 1}`} loading="lazy" />
              <span>+</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function CasesPageLuxury({ data, isArabic }: { data: SiteData; isArabic: boolean }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const configuredCaseIds = data.homeConfig?.caseIds || [];
  const orderedGallery = configuredCaseIds.length
    ? configuredCaseIds.map((id) => data.gallery.find((item) => item.id === id)).filter(Boolean) as GalleryItem[]
    : data.gallery;
  const cases = (orderedGallery.length ? orderedGallery : fallbackData.gallery).map((item, index) => parseCase(item, index));
  const featuredCase = cases.find((item) => item.featured) || cases[0];
  const selectedCase = selected ? parseCase(selected) : null;
  const pageCopy = data.builderConfig?.casesPage || {};

  return (
    <section className="section-block page-content cases-luxury-page">
      <div className="cases-editorial-head">
        <div>
          <p className="section-label"><Sparkles size={16} /> {isArabic ? (pageCopy.labelAr || "معرض الابتسامات") : (pageCopy.labelEn || "Smile Transformations")}</p>
          <h2>{isArabic ? (pageCopy.titleAr || "نتائج قبل وبعد بتفاصيل واضحة") : (pageCopy.titleEn || "Before & After Results, Clearly Presented")}</h2>
          <p>
            {isArabic
              ? (pageCopy.textAr || "كل حالة معروضة بطريقة تساعدك تشوف الفرق بهدوء: نوع العلاج، مدة التنفيذ، وصورة مقارنة تفاعلية بدون تشتيت.")
              : (pageCopy.textEn || "Each case is presented with a calm comparison experience: treatment type, duration, and an interactive result viewer.")}
          </p>
        </div>
        <div className="cases-proof-panel" aria-label={isArabic ? "مؤشرات الثقة" : "Trust indicators"}>
          <span><ShieldCheck size={18} /> {isArabic ? (pageCopy.proof1Ar || "صور مسموح بعرضها") : (pageCopy.proof1En || "Approved clinical photos")}</span>
          <span><ClipboardCheck size={18} /> {isArabic ? (pageCopy.proof2Ar || "تفاصيل علاج مختصرة") : (pageCopy.proof2En || "Clear treatment notes")}</span>
          <span><SmilePlus size={18} /> {isArabic ? (pageCopy.proof3Ar || `${cases.length}+ حالة`) : (pageCopy.proof3En || `${cases.length}+ cases`)}</span>
        </div>
      </div>

      <div className="comparison-card cases-hero-comparison">
        <div className="cases-comparison-copy">
          <small>{featuredCase.featured ? (isArabic ? "حالة مختارة" : "Selected case") : featuredCase.category}</small>
          <h3>{isArabic && featuredCase.title.startsWith("Case") ? `حالة ${featuredCase.id}` : featuredCase.title}</h3>
          <p>{isArabic ? "اعرض النتيجة بشكل مباشر: صورة قبل وصورة بعد جنب بعض عشان الفرق يبقى واضح من أول نظرة." : "View the transformation directly: before and after images side by side for an immediate comparison."}</p>
          <div>
            <span>{isArabic ? "العلاج" : "Treatment"}: {featuredCase.category}</span>
            <span>{isArabic ? "المدة" : "Duration"}: {featuredCase.duration}</span>
          </div>
        </div>
        <div className="comparison-pair">
          <figure className="comparison-frame before-frame">
            <img src={featuredCase.beforeImage} alt={`${featuredCase.title} before`} loading="lazy" />
            <figcaption>{isArabic ? "قبل" : "Before"}</figcaption>
          </figure>
          <figure className="comparison-frame after-frame">
            <img src={featuredCase.afterImage} alt={`${featuredCase.title} after`} loading="lazy" />
            <figcaption>{isArabic ? "بعد" : "After"}</figcaption>
          </figure>
        </div>
      </div>

      <div className="cases-filter-strip" aria-label={isArabic ? "مميزات عرض الحالات" : "Case gallery highlights"}>
        <span>{isArabic ? "قبل وبعد جنب بعض" : "Side-by-side comparison"}</span>
        <span>{isArabic ? "صور كبيرة وواضحة" : "Large clear visuals"}</span>
        <span>{isArabic ? "مناسب للموبايل" : "Mobile friendly"}</span>
      </div>

      <div className="premium-case-grid">
        {cases.map((item) => (
          <PremiumCaseCard caseItem={item} isArabic={isArabic} onOpen={() => setSelected(item)} key={item.id} />
        ))}
      </div>
      {selected ? (
        <div className="lightbox case-lightbox" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <button className="close-button" type="button" aria-label="Close image"><X size={22} /></button>
          {selectedCase ? (
            <div className="case-lightbox-panel" onClick={(event) => event.stopPropagation()}>
              <div className="case-lightbox-images">
                <figure>
                  <img src={selectedCase.beforeImage} alt={`${selectedCase.title} before`} loading="lazy" />
                  <figcaption>{isArabic ? "قبل" : "Before"}</figcaption>
                </figure>
                <figure>
                  <img src={selectedCase.afterImage} alt={`${selectedCase.title} after`} loading="lazy" />
                  <figcaption>{isArabic ? "بعد" : "After"}</figcaption>
                </figure>
              </div>
              <div className="case-lightbox-meta">
                <strong>{isArabic && selectedCase.title.startsWith("Case") ? `حالة ${selectedCase.id}` : selectedCase.title}</strong>
                <span>{isArabic ? "نوع العلاج" : "Treatment"}: {selectedCase.category}</span>
                <span>{isArabic ? "المدة" : "Duration"}: {selectedCase.duration}</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function PremiumCaseCard({ caseItem, isArabic, onOpen }: { caseItem: ParsedCase; isArabic: boolean; onOpen: () => void }) {
  return (
    <article className={caseItem.featured ? "premium-case-card featured" : "premium-case-card"}>
      {caseItem.featured ? <span className="case-featured-ribbon">{isArabic ? "مميزة" : "Featured"}</span> : null}
      <div className="case-compare-pair">
        <figure>
          <img src={caseItem.beforeImage} alt={`${caseItem.title} before`} loading="lazy" />
          <figcaption>{isArabic ? "قبل" : "Before"}</figcaption>
        </figure>
        <figure>
          <img src={caseItem.afterImage} alt={`${caseItem.title} after`} loading="lazy" />
          <figcaption>{isArabic ? "بعد" : "After"}</figcaption>
        </figure>
      </div>
      <div className="case-meta">
        <small>{caseItem.featured ? (isArabic ? "حالة مميزة" : "Featured Case") : caseItem.category}</small>
        <h3>{isArabic && caseItem.title.startsWith("Case") ? `حالة ${caseItem.id}` : caseItem.title}</h3>
        <div>
          <span><ClipboardCheck size={15} /> {isArabic ? "نوع العلاج" : "Treatment"}: {caseItem.category}</span>
          <span><CalendarCheck size={15} /> {isArabic ? "المدة" : "Duration"}: {caseItem.duration}</span>
        </div>
        <button type="button" onClick={onOpen}>{isArabic ? "عرض النتيجة" : "View Result"}</button>
      </div>
    </article>
  );
}

function BlogPageLuxury({ data, isArabic }: { data: SiteData; isArabic: boolean }) {
  const fallbackArticles: Article[] = [
    { id: 101, title: isArabic ? "روتين يومي يحافظ على صحة الأسنان" : "A Daily Routine for Healthier Teeth", body: isArabic ? "خطوات بسيطة تقلل التسوس وتحافظ على اللثة." : "Simple steps that reduce cavities and keep gums healthy.", conclusion: isArabic ? "الاستمرارية أهم من التعقيد." : "Consistency matters more than complexity.", slug: "" },
    { id: 102, title: isArabic ? "متى تحتاج لتجميل الأسنان؟" : "When Do You Need Cosmetic Dentistry?", body: isArabic ? "اختيار التجميل يعتمد على اللون والشكل والعضة." : "Cosmetic planning depends on color, shape, and bite.", conclusion: isArabic ? "الخطة الصحيحة تبدأ بتشخيص دقيق." : "A strong plan starts with accurate diagnosis.", slug: "" },
    { id: 103, title: isArabic ? "التقويم الشفاف: هل يناسبك؟" : "Clear Aligners: Are They Right for You?", body: isArabic ? "حل مريح وشفاف لتحسين ترتيب الأسنان في حالات كثيرة." : "A comfortable invisible solution for many alignment cases.", conclusion: isArabic ? "الكشف يحدد الاختيار الأفضل." : "A consultation defines the best option.", slug: "" },
  ];
  const configuredArticleIds = data.homeConfig?.articleIds || [];
  const orderedArticles = configuredArticleIds.length
    ? configuredArticleIds.map((id) => data.articles.find((item) => item.id === id)).filter(Boolean) as Article[]
    : data.articles;
  const articles = orderedArticles.length >= 3 ? orderedArticles : fallbackArticles;
  const faqs = (data.faq || []).filter((item) => item.page === "blog" || item.page === "all");
  const questionItems = enabledItems(data.builderConfig?.patientQuestions, patientQuestions.map((question) => ({
    questionAr: question[0],
    questionEn: question[1],
    answerAr: question[2],
    answerEn: question[2],
  })));
  const thumbImages = data.builderConfig?.blogThumbs?.length ? data.builderConfig.blogThumbs : blogThumbs;

  return (
    <section className="section-block page-content">
      <div className="patient-question-grid">
        {questionItems.map((question, index) => (
          <article className="patient-question-card" key={question.questionAr || question.questionEn || index}>
            <span>Q{index + 1}</span>
            <h3>{isArabic ? question.questionAr : question.questionEn}</h3>
            <p>{isArabic ? question.answerAr : (question.answerEn || question.answerAr)}</p>
          </article>
        ))}
      </div>
      <div className="article-grid blog-grid">
        {articles.map((article, index) => (
          <article className="article-card blog-lux-card" key={article.id}>
            <img className="blog-thumb" src={article.cover_image || thumbImages[index % thumbImages.length]} alt="" aria-hidden="true" loading="lazy" />
            <small>{isArabic ? "تثقيف المرضى" : "Patient Education"}</small>
            <h3>{article.title}</h3>
            <p>{isArabic ? (article.excerpt_ar || article.meta_description || article.body) : (article.excerpt_en || article.excerpt_ar || article.meta_description || article.body)}</p>
            <a href={article.slug ? `/blog/${article.slug}` : "/blog"}>{isArabic ? "اقرأ المزيد" : "Read More"} <ChevronRight size={16} /></a>
          </article>
        ))}
      </div>
      <FaqBlock items={faqs} isArabic={isArabic} />
    </section>
  );
}

function FaqBlock({ items, isArabic }: { items: FaqItem[]; isArabic: boolean }) {
  if (!items.length) return null;
  return (
    <div className="faq-block">
      <p className="section-label">FAQ</p>
      <h2>{isArabic ? "أسئلة شائعة" : "Frequently Asked Questions"}</h2>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.id}>
            <summary>{isArabic ? item.question_ar : item.question_en}</summary>
            <p>{isArabic ? item.answer_ar : item.answer_en}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function ArticleDetailPage({ article, isArabic, builder }: { article: Article; isArabic: boolean; builder?: BuilderConfig }) {
  const [shareMessage, setShareMessage] = useState("");
  const labels = builder?.articleLabels || {};
  const articleFaqs = parseArticleFaqItems(article.faq_items).filter((item) => item.questionAr || item.questionEn || item.answerAr || item.answerEn);
  const displayExcerpt = isArabic ? (article.excerpt_ar || article.meta_description) : (article.excerpt_en || article.excerpt_ar || article.meta_description);

  async function shareArticle() {
    const url = typeof window !== "undefined" ? window.location.href : `/blog/${article.slug}`;
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "article_share", label: article.slug || article.id }),
    }).catch(() => null);
    if (navigator.share) {
      await navigator.share({ title: article.title, text: article.meta_description || article.body.slice(0, 140), url });
      setShareMessage(isArabic ? "تم فتح مشاركة المقال." : "Share dialog opened.");
      return;
    }

    await navigator.clipboard.writeText(url);
    setShareMessage(isArabic ? "تم نسخ رابط المقال." : "Article link copied.");
  }

  return (
    <article className="article-detail page-content">
      <a className="article-back-link" href="/blog">{isArabic ? "العودة للمقالات" : "Back to Blog"}</a>
      {article.cover_image ? <img className="article-detail-cover" src={article.cover_image} alt={article.title} loading="eager" /> : null}
      <div className="article-detail-body">
        <p className="section-label">{isArabic ? (labels.detailLabelAr || "مقال تثقيفي") : (labels.detailLabelEn || "Patient Education")}</p>
        <h1>{article.title}</h1>
        <div className="article-meta-row">
          <span>{article.category || (isArabic ? "نصائح العيادة" : "Clinic Tips")}</span>
          <span>{article.author || "Dr. Amr Elshamy"}</span>
          <span>{article.updated_at ? new Date(article.updated_at).toLocaleDateString(isArabic ? "ar-EG" : "en-US") : ""}</span>
        </div>
        {displayExcerpt ? <p className="article-summary">{displayExcerpt}</p> : null}
        <div className="article-content">
          {renderArticleContent(article.body)}
        </div>
        {articleFaqs.length ? (
          <div className="article-faq-inline">
            <p className="section-label">FAQ</p>
            {articleFaqs.map((faq, index) => (
              <details key={`${faq.questionAr || faq.questionEn}-${index}`}>
                <summary>{isArabic ? (faq.questionAr || faq.questionEn) : (faq.questionEn || faq.questionAr)}</summary>
                <p>{isArabic ? (faq.answerAr || faq.answerEn) : (faq.answerEn || faq.answerAr)}</p>
              </details>
            ))}
          </div>
        ) : null}
        {article.conclusion ? (
          <footer className="article-footer-note">
            <span>{isArabic ? (labels.footerLabelAr || "فوتر المقال") : (labels.footerLabelEn || "Article Footer")}</span>
            <strong>{article.conclusion}</strong>
          </footer>
        ) : null}
        <a className="primary-button article-book-button" href={whatsappLink(isArabic ? "مرحباً، قرأت مقال على الموقع وعايز أحجز استشارة." : "Hello, I read an article on the website and would like to book a consultation.", defaultSiteSettings.whatsappPhone)} target="_blank" rel="noreferrer">
          {isArabic ? "احجز استشارة الآن" : "Book a Consultation"}
        </a>
        <button className="secondary-button article-share-button" type="button" onClick={() => void shareArticle()}>
          {isArabic ? (labels.shareAr || "مشاركة المقال") : (labels.shareEn || "Share Article")} <ChevronRight size={16} />
        </button>
        {shareMessage ? <p className="success-message">{shareMessage}</p> : null}
      </div>
    </article>
  );
}

function NotFoundPage({ isArabic }: { isArabic: boolean }) {
  return (
    <section className="not-found-page page-content">
      <img src="/brand/logo-transparent.png" alt="Dr. Amr Elshamy" />
      <p className="section-label">404</p>
      <h1>{isArabic ? "الصفحة غير موجودة" : "Page Not Found"}</h1>
      <p>{isArabic ? "الرابط غير صحيح أو تم نقل الصفحة. تقدر ترجع للرئيسية أو تتواصل مع العيادة." : "This page may have moved. You can return home or contact the clinic."}</p>
      <div>
        <a className="primary-button" href="/">{isArabic ? "العودة للرئيسية" : "Back Home"}</a>
        <a className="secondary-button" href={`https://wa.me/${whatsappPrimary}`}>WhatsApp</a>
      </div>
    </section>
  );
}

function ContactPageLuxury({
  booking,
  setBooking,
  submitBooking,
  t,
  isArabic,
  settings,
  bookingSent,
  formConfig,
}: {
  booking: { name: string; phone: string; service: string; message: string };
  setBooking: (booking: { name: string; phone: string; service: string; message: string }) => void;
  submitBooking: (event: FormEvent<HTMLFormElement>) => void;
  t: (typeof copy)[Lang];
  isArabic: boolean;
  settings: SiteSettings;
  bookingSent: boolean;
  formConfig?: FormConfig;
}) {
  const form = { requireName: true, requirePhone: false, showAge: false, showImage: false, showDate: true, showMessage: true, ...formConfig };
  return (
    <section className="contact-section page-content">
      <div className="contact-card contact-lux-card">
        <h2>{t.pages.contact[1]}</h2>
        <p className="section-text">{t.pages.contact[2]}</p>
        <a className="map-panel" href={mapUrl} target="_blank" rel="noreferrer" aria-label="Open clinic location">
          <img src="/inner/map-gold-pin.png" alt="Clinic location map" />
        </a>
        <div className="contact-links">
          <a href={`tel:${settings.phonePrimary}`}><Phone size={18} /> <span className="phone-number">{settings.phonePrimary}</span></a>
          <a href={`tel:${settings.phoneSecondary}`}><Phone size={18} /> <span className="phone-number">{settings.phoneSecondary}</span></a>
          <a href={settings.mapUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> {t.address}</a>
        </div>
      </div>
      <form className="booking-form booking-lux-form" onSubmit={submitBooking}>
        <input required={form.requireName} value={booking.name} onChange={(event) => setBooking({ ...booking, name: event.target.value })} placeholder={t.formName} />
        <input required={form.requirePhone} value={booking.phone} onChange={(event) => setBooking({ ...booking, phone: event.target.value })} placeholder={t.formPhone} />
        {form.showAge ? <input onChange={(event) => setBooking({ ...booking, message: `${booking.message}\n${isArabic ? "السن" : "Age"}: ${event.target.value}` })} placeholder={isArabic ? "السن" : "Age"} /> : null}
        <select value={booking.service} onChange={(event) => setBooking({ ...booking, service: event.target.value })}>
          <option value="">{t.formService}</option>
          {services.map((service) => <option value={isArabic ? service[1] : service[0]} key={service[0]}>{isArabic ? service[1] : service[0]}</option>)}
        </select>
        {form.showDate ? <input type="date" onChange={(event) => setBooking({ ...booking, message: `${booking.message}\n${isArabic ? "تاريخ مفضل" : "Preferred date"}: ${event.target.value}` })} /> : null}
        {form.showImage ? <input type="file" accept="image/*" onChange={(event) => setBooking({ ...booking, message: `${booking.message}\n${isArabic ? "يوجد صورة مرفقة باسم" : "Image selected"}: ${event.target.files?.[0]?.name || "-"}` })} /> : null}
        {form.showMessage ? <textarea value={booking.message} onChange={(event) => setBooking({ ...booking, message: event.target.value })} placeholder={t.formMessage} /> : null}
        <button className="primary-button" type="submit"><WhatsAppIcon size={18} /> {t.sendWhatsApp}</button>
        {bookingSent ? <p className="success-message">{isArabic ? "تم فتح واتساب برسالة الحجز. ابعتها للعيادة لتأكيد التواصل." : "WhatsApp opened with your booking message. Send it to confirm contact."}</p> : null}
      </form>
    </section>
  );
}

function BookingModal({
  booking,
  setBooking,
  submitBooking,
  t,
  isArabic,
  onClose,
  settings,
  onSuccess,
}: {
  booking: { name: string; phone: string; service: string; message: string };
  setBooking: (booking: { name: string; phone: string; service: string; message: string }) => void;
  submitBooking: (event: FormEvent<HTMLFormElement>) => void;
  t: (typeof copy)[Lang];
  isArabic: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onSuccess: () => void;
}) {
  const [preferredDate, setPreferredDate] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lines = [
      isArabic ? "مرحبًا، أريد حجز موعد في عيادة Dr. Amr Elshamy." : "Hello, I would like to book an appointment at Dr. Amr Elshamy Dental Clinic.",
      booking.name ? `${isArabic ? "اسم المريض" : "Patient Name"}: ${booking.name}` : "",
      booking.service ? `${isArabic ? "الخدمة المطلوبة" : "Service Needed"}: ${booking.service}` : "",
      preferredDate ? `${isArabic ? "الموعد المفضل" : "Preferred date"}: ${preferredDate}` : "",
    ].filter(Boolean);
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...booking, preferredDate, message: lines.join("\n") }),
    }).catch(() => null);
    window.open(`https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
    onSuccess();
  }

  return (
    <div className="booking-modal-overlay" role="dialog" aria-modal="true">
      <form className="booking-modal" onSubmit={submit}>
        <button className="close-button" type="button" onClick={onClose} aria-label="Close booking modal"><X size={20} /></button>
        <img src="/brand/logo-transparent.png" alt="Dr. Amr Elshamy logo" />
        <h2>{isArabic ? "تأكيد الحجز عبر واتساب" : "Confirm Booking via WhatsApp"}</h2>
        <p>{isArabic ? "اكتب بياناتك وسيتم تجهيز رسالة واتساب تلقائيًا." : "Enter your details and we will prepare your WhatsApp message automatically."}</p>
        <input required value={booking.name} onChange={(event) => setBooking({ ...booking, name: event.target.value })} placeholder={isArabic ? "اسم المريض" : "Patient Name"} />
        <select value={booking.service} onChange={(event) => setBooking({ ...booking, service: event.target.value })}>
          <option value="">{isArabic ? "الخدمة المطلوبة" : "Service Needed"}</option>
          {services.map((service) => <option value={isArabic ? service[1] : service[0]} key={service[0]}>{isArabic ? service[1] : service[0]}</option>)}
        </select>
        <input type="date" value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} />
        <button className="whatsapp-confirm" type="submit"><WhatsAppIcon size={20} /> {isArabic ? "تأكيد الحجز عبر واتساب" : "Confirm Booking via WhatsApp"}</button>
      </form>
    </div>
  );
}

function getServiceBySlug(slug: ServiceSlug) {
  const index = Math.max(0, serviceSlugs.indexOf(slug));
  const service = services[index];
  return { index, service };
}

function ServiceDetailIntro({ slug, isArabic, data }: { slug: ServiceSlug; isArabic: boolean; data: SiteData }) {
  const { index, service } = getServiceBySlug(slug);
  const dynamicService = serviceListFromData(data).find((item) => item.slug === slug);
  const title = dynamicService ? (isArabic ? dynamicService.titleAr : dynamicService.titleEn) : (isArabic ? service[1] : service[0]);
  const description = dynamicService ? (isArabic ? dynamicService.descriptionAr : dynamicService.descriptionEn) : (isArabic ? service[2] : service[3]);
  return (
    <section className="page-hero service-detail-hero">
      <img className="service-detail-icon" src={dynamicService?.icon || serviceIcons[index]} alt="" aria-hidden="true" loading="lazy" />
      <p className="section-label">{isArabic ? "خدمة متخصصة" : "Specialized Service"}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

function ServiceDetailPage({ slug, isArabic, settings, data }: { slug: ServiceSlug; isArabic: boolean; settings: SiteSettings; data: SiteData }) {
  const { index, service } = getServiceBySlug(slug);
  const dynamicService = serviceListFromData(data).find((item) => item.slug === slug);
  const title = dynamicService ? (isArabic ? dynamicService.titleAr : dynamicService.titleEn) : (isArabic ? service[1] : service[0]);
  const ctaLabel = dynamicService ? (isArabic ? dynamicService.titleAr : dynamicService.titleEn) : (isArabic ? service[1] : service[0]);
  const steps = isArabic
    ? ["تقييم الحالة بدقة", "شرح خطة العلاج", "تنفيذ مريح وآمن", "متابعة النتيجة"]
    : ["Precise case assessment", "Clear treatment planning", "Comfortable safe procedure", "Result follow-up"];
  const ctaMessage = dynamicService
    ? (isArabic ? dynamicService.whatsappMessageAr : dynamicService.whatsappMessageEn) || serviceWhatsAppMessage(slug, isArabic)
    : serviceWhatsAppMessage(slug, isArabic);

  return (
    <section className="service-detail-layout page-content">
      <div className="service-detail-main">
        <h2>{isArabic ? "رحلة علاج واضحة من أول زيارة" : "A Clear Treatment Journey From the First Visit"}</h2>
        <p>{isArabic ? "كل خدمة مصممة عشان تكون مريحة، مفهومة، ومناسبة لحالتك. بنشرح البدائل والتوقعات قبل أي خطوة." : "Every service is designed to be comfortable, clear, and tailored to your case. We explain options and expectations before every step."}</p>
        <div className="treatment-steps">
          {steps.map((step, stepIndex) => (
            <article key={step}>
              <span>{String(stepIndex + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </article>
          ))}
        </div>
      </div>
      <aside className="service-detail-side">
        <img src={dynamicService?.icon || serviceIcons[index]} alt="" aria-hidden="true" loading="lazy" />
        <h3>{title}</h3>
        <p>{isArabic ? "احجز استشارة بسيطة عبر واتساب وابدأ بخطة واضحة." : "Book a simple WhatsApp consultation and start with a clear plan."}</p>
        <a className="primary-button service-whatsapp-cta" href={whatsappLink(ctaMessage, settings.whatsappPhone)} target="_blank" rel="noreferrer">
          <WhatsAppIcon size={18} />
          {isArabic ? `احجز الخدمة - ${ctaLabel}` : `Book This Service - ${ctaLabel}`}
        </a>
      </aside>
    </section>
  );
}

function Footer({ t, settings, config }: { t: (typeof copy)[Lang]; settings: SiteSettings; config?: HeaderFooterConfig }) {
  const isArabic = t.dir === "rtl";
  const orderedNav = config?.navOrder?.length
    ? config.navOrder.map((pageKey) => nav.find((item) => item.page === pageKey)).filter(Boolean) as typeof nav
    : nav;
  const quickLinks = orderedNav.filter((item) => item.page !== "home").slice(0, 5);
  const footerServices = services.slice(0, 5);
  const mapEmbedUrl = "https://www.google.com/maps?q=Dr.%20Amr%20Elshamy%20Dental%20Clinic%20Nasr%20City%20Cairo&output=embed";
  const logo = config?.logo || "/brand/logo-transparent.png";
  const footerText = isArabic ? (config?.footerTextAr || t.footer) : (config?.footerTextEn || t.footer);
  const showSocial = config?.showSocial !== false;

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logo} alt="Dr. Amr Elshamy logo" loading="lazy" />
          <p>{footerText}</p>
          {showSocial ? <div className="socials">
            <a className="facebook-social" href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a className="instagram-social" href={settings.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a className="tiktok-social" href={settings.tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTokIcon /></a>
            <a className="whatsapp-social" href={`https://wa.me/${settings.whatsappPhone}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>
          </div> : null}
        </div>

        <div className="footer-map-card">
          <iframe
            src={mapEmbedUrl}
            title={isArabic ? "موقع عيادة Dr. Amr Elshamy على خرائط جوجل" : "Dr. Amr Elshamy clinic location on Google Maps"}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a href={settings.mapUrl} target="_blank" rel="noreferrer"><MapPin size={16} /> {isArabic ? "افتح الموقع على Google Maps" : "Open in Google Maps"}</a>
        </div>

        <div className="footer-links-panel">
          <div className="footer-col">
            <h3>{isArabic ? "روابط سريعة" : "Quick Links"}</h3>
            {quickLinks.map((item) => (
              <a href={item.href} key={item.href}>{isArabic ? item.ar : item.en}</a>
            ))}
          </div>

          <div className="footer-col">
            <h3>{isArabic ? "خدماتنا" : "Our Services"}</h3>
            {footerServices.map((service) => (
              <a href="/services" key={service[0]}>{isArabic ? service[1] : service[0]}</a>
            ))}
          </div>

          <div className="footer-col contact-footer">
            <h3>{isArabic ? "تواصل معنا" : "Contact Us"}</h3>
            <a className="phone-link" href={`tel:${settings.phonePrimary}`}><Phone size={16} /> <span className="phone-number">{settings.phonePrimary}</span></a>
            <a className="phone-link" href={`tel:${settings.phoneSecondary}`}><Phone size={16} /> <span className="phone-number">{settings.phoneSecondary}</span></a>
            <a href={`https://wa.me/${settings.whatsappPhone}`} target="_blank" rel="noreferrer"><WhatsAppIcon size={16} /> {isArabic ? "الحجز عبر واتساب" : "Book via WhatsApp"}</a>
            <a href="/admin"><Lock size={16} /> {t.admin}</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Dr. Amr Elshamy Dental Clinic. {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
      </div>
    </footer>
  );
}

type AdminView = "home" | "control" | "homeContent" | "doctor" | "servicesManager" | "articles" | "reviews" | "gallery" | "bookings" | "faq" | "seo" | "analytics" | "media" | "activity" | "users" | "import" | "settings" | "security";

function AdminPage({ lang, t }: { lang: Lang; t: (typeof copy)[Lang] }) {
  const isArabic = lang === "ar";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeView, setActiveView] = useState<AdminView>("home");
  const [session, setSession] = useState<AdminSessionInfo | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewTick, setPreviewTick] = useState(0);
  const [stats, setStats] = useState({ totalVisitors: 0, publishedArticles: 0, activeServices: 0, pendingReviews: 0, draftArticles: 0, newBookings: 0, alerts: [] as string[] });
  const [adminError, setAdminError] = useState("");
  const previewPath = adminPreviewPath(activeView);

  async function loadDashboard() {
    const [response, sessionResponse] = await Promise.all([
      fetch("/api/admin/dashboard"),
      fetch("/api/admin/session"),
    ]);
    if (sessionResponse.ok) {
      const nextSession = await sessionResponse.json() as AdminSessionInfo;
      setSession(nextSession);
      const allowed = allowedAdminViews(nextSession);
      if (!allowed.includes(activeView)) setActiveView(allowed[0] || "home");
    }
    if (response.ok) {
      setStats(await response.json());
      setAdminError("");
      setLoggedIn(true);
    } else if (response.status === 401) {
      setLoggedIn(false);
    }
    setCheckingSession(false);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdminError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setLoggedIn(true);
      await loadDashboard();
      return;
    }

    setAdminError(isArabic ? "اسم المستخدم أو كلمة المرور غير صحيحة." : "Invalid username or password.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  useEffect(() => {
    if (!previewPath) return;
    const refresh = () => setPreviewTick((current) => current + 1);
    window.addEventListener("admin-live-preview-refresh", refresh);
    const timer = window.setInterval(() => setPreviewTick((current) => current + 1), 4500);
    return () => {
      window.removeEventListener("admin-live-preview-refresh", refresh);
      window.clearInterval(timer);
    };
  }, [previewPath]);

  if (checkingSession) {
    return (
      <section className="admin-page admin-shell-page">
        <div className="admin-login admin-clean-login">
          <Lock size={38} />
          <h2>{isArabic ? "جاري فحص الجلسة" : "Checking Session"}</h2>
          <p>{isArabic ? "لحظات ونفتح لوحة التحكم." : "Just a moment while the dashboard opens."}</p>
        </div>
      </section>
    );
  }

  if (!loggedIn) {
    return (
      <section className="admin-page admin-shell-page">
        <form className="admin-login admin-clean-login" onSubmit={login}>
          <Lock size={38} />
          <h2>{isArabic ? "دخول لوحة التحكم" : "Admin Dashboard Login"}</h2>
          <p>{isArabic ? "واجهة بسيطة لإدارة المقالات ومراجعات المرضى." : "A simple workspace for articles and patient reviews."}</p>
          <input type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={isArabic ? "اسم المستخدم" : "Username"} />
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t.password} />
          {adminError ? <span className="admin-error">{adminError}</span> : null}
          <button className="primary-button" type="submit">{t.login}</button>
          <small>{isArabic ? "بيانات الدخول يتم ضبطها من ملف البيئة على الاستضافة." : "Credentials are configured from hosting environment variables."}</small>
        </form>
      </section>
    );
  }

  return (
    <section className={sidebarCollapsed ? "admin-page admin-dashboard-shell sidebar-collapsed" : "admin-page admin-dashboard-shell"}>
      <AdminSidebar activeView={activeView} isArabic={isArabic} session={session} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((current) => !current)} onNavigate={setActiveView} onLogout={logout} />
      <main className="admin-main-panel">
        <header className="admin-main-header">
          <div>
            <p className="section-label">{isArabic ? "لوحة تحكم العيادة" : "Clinic Admin"}</p>
            <nav className="admin-breadcrumbs" aria-label="Breadcrumbs">
              <span>{isArabic ? "لوحة التحكم" : "Dashboard"}</span>
              <ChevronRight size={14} />
              <strong>{adminViewTitle(activeView, isArabic)}</strong>
            </nav>
            <h2>{adminViewTitle(activeView, isArabic)}</h2>
          </div>
          <div className="admin-top-actions">
            <a className="secondary-button admin-public-link" href="/" target="_blank" rel="noreferrer">
              {isArabic ? "عرض الموقع العام" : "View Public Site"}
            </a>
            <button className="secondary-button" type="button" onClick={() => { setPreviewTick((current) => current + 1); void loadDashboard(); }}>{isArabic ? "تحديث" : "Refresh"}</button>
          </div>
        </header>

        <AdminLiveWorkspace previewPath={previewPath} previewTick={previewTick} isArabic={isArabic}>
          {activeView === "home" ? <AdminOverview stats={stats} isArabic={isArabic} /> : null}
          {activeView === "control" ? <ControlCenterManager isArabic={isArabic} /> : null}
          {activeView === "homeContent" ? <HomeContentManager isArabic={isArabic} /> : null}
          {activeView === "doctor" ? <DoctorProfileManager isArabic={isArabic} /> : null}
          {activeView === "servicesManager" ? <ServicesManager isArabic={isArabic} /> : null}
          {activeView === "articles" ? <ArticlesManager isArabic={isArabic} onStatsChange={loadDashboard} /> : null}
          {activeView === "reviews" ? <ReviewsManager isArabic={isArabic} onStatsChange={loadDashboard} /> : null}
          {activeView === "gallery" ? <GalleryManager isArabic={isArabic} /> : null}
          {activeView === "bookings" ? <BookingsManager isArabic={isArabic} onStatsChange={loadDashboard} /> : null}
          {activeView === "faq" ? <FaqManager isArabic={isArabic} /> : null}
          {activeView === "seo" ? <SeoManager isArabic={isArabic} /> : null}
          {activeView === "analytics" ? <AnalyticsManager isArabic={isArabic} /> : null}
          {activeView === "media" ? <MediaManager isArabic={isArabic} /> : null}
          {activeView === "activity" ? <ActivityManager isArabic={isArabic} /> : null}
          {activeView === "users" ? <UsersManager isArabic={isArabic} /> : null}
          {activeView === "import" ? <ImportManager isArabic={isArabic} /> : null}
          {activeView === "settings" ? <SettingsManager isArabic={isArabic} /> : null}
          {activeView === "security" ? <SecurityManager isArabic={isArabic} /> : null}
        </AdminLiveWorkspace>
      </main>
    </section>
  );
}

function adminPreviewPath(view: AdminView) {
  const paths: Partial<Record<AdminView, string>> = {
    home: "/",
    control: "/",
    homeContent: "/",
    doctor: "/about",
    servicesManager: "/services",
    articles: "/blog",
    reviews: "/reviews",
    gallery: "/cases",
    faq: "/services",
    seo: "/",
    settings: "/contact",
  };
  return paths[view] || "";
}

function AdminLiveWorkspace({ children, previewPath, previewTick, isArabic }: { children: ReactNode; previewPath: string; previewTick: number; isArabic: boolean }) {
  if (!previewPath) return <>{children}</>;
  const separator = previewPath.includes("?") ? "&" : "?";
  const src = `${previewPath}${separator}adminLive=${previewTick}`;

  return (
    <div className="admin-live-workspace">
      <div className="admin-editor-zone">{children}</div>
      <aside className="admin-live-preview-card" aria-label={isArabic ? "معاينة مباشرة للموقع" : "Live website preview"}>
        <div className="admin-live-preview-head">
          <div>
            <strong>{isArabic ? "معاينة مباشرة" : "Live Preview"}</strong>
            <span>{isArabic ? "تتحدث تلقائياً بعد الحفظ" : "Auto-refreshes after edits"}</span>
          </div>
          <a href={previewPath} target="_blank" rel="noreferrer">{isArabic ? "فتح" : "Open"}</a>
        </div>
        <iframe src={src} title={isArabic ? "معاينة الموقع" : "Website preview"} loading="lazy" />
      </aside>
    </div>
  );
}

function refreshAdminLivePreview() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-live-preview-refresh"));
  }
}

function adminViewTitle(view: AdminView, isArabic: boolean) {
  const titles: Record<AdminView, [string, string]> = {
    home: ["نظرة عامة", "Overview"],
    control: ["مركز التحكم", "Control Center"],
    homeContent: ["إدارة الهوم", "Home Management"],
    doctor: ["بيانات الدكتور", "Doctor Profile"],
    servicesManager: ["إدارة الخدمات", "Services CMS"],
    articles: ["إدارة المقالات", "Articles Management"],
    reviews: ["مراجعات المرضى", "Patient Reviews"],
    gallery: ["حالات قبل وبعد", "Before & After Cases"],
    bookings: ["رسائل الحجز", "Booking Requests"],
    faq: ["الأسئلة الشائعة", "FAQ"],
    seo: ["إعدادات SEO", "SEO Settings"],
    analytics: ["التحليلات", "Analytics"],
    media: ["مكتبة الصور", "Media Library"],
    activity: ["سجل النشاط", "Activity Log"],
    users: ["المستخدمين والصلاحيات", "Users & Permissions"],
    import: ["استرجاع نسخة", "Import Backup"],
    settings: ["إعدادات الموقع", "Site Settings"],
    security: ["الأمان والنسخ الاحتياطي", "Security & Backup"],
  };

  return isArabic ? titles[view][0] : titles[view][1];
}

function allowedAdminViews(session: AdminSessionInfo | null): AdminView[] {
  if (!session) return ["home"];
  if (session.isSuperAdmin || ["admin", "owner", "super-admin", "super_admin"].includes(session.role || "")) {
    return ["home", "control", "homeContent", "doctor", "servicesManager", "articles", "reviews", "gallery", "bookings", "faq", "seo", "analytics", "media", "activity", "users", "import", "settings", "security"];
  }
  if (session.role === "content-writer") return ["articles"];
  if (session.role === "moderator") return ["reviews"];
  const permissions = new Set(session.permissions || []);
  const mapping: Array<[AdminView, string]> = [
    ["home", "dashboard"], ["articles", "articles"], ["reviews", "reviews"], ["gallery", "gallery"], ["servicesManager", "services"], ["media", "media"], ["settings", "settings"], ["bookings", "bookings"], ["analytics", "analytics"], ["security", "security"], ["users", "users"],
  ];
  const allowed = mapping.filter(([, permission]) => permissions.has(permission) || permissions.has("all")).map(([view]) => view);
  return allowed.length ? allowed : ["home"];
}

type AdminSidebarProps = {
  activeView: AdminView;
  isArabic: boolean;
  session: AdminSessionInfo | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: (view: AdminView) => void;
  onLogout: () => void;
};

function AdminSidebar({ activeView, isArabic, session, collapsed, onToggleCollapse, onNavigate, onLogout }: AdminSidebarProps) {
  const allowedViews = new Set(allowedAdminViews(session));
  const siteLinks = [
    { key: "home" as const, label: isArabic ? "الرئيسية" : "Home", icon: <ClipboardCheck size={22} /> },
    { key: "control" as const, label: isArabic ? "مركز التحكم" : "Control", icon: <Sparkles size={22} /> },
    { key: "homeContent" as const, label: isArabic ? "إدارة الهوم" : "Home CMS", icon: <SearchCheck size={22} /> },
    { key: "doctor" as const, label: isArabic ? "الدكتور" : "Doctor", icon: <Stethoscope size={22} /> },
    { key: "servicesManager" as const, label: isArabic ? "الخدمات" : "Services", icon: <SmilePlus size={22} /> },
    { key: "articles" as const, label: isArabic ? "المقالات" : "Articles", icon: <ClipboardList size={22} /> },
    { key: "reviews" as const, label: isArabic ? "الآراء" : "Reviews", icon: <Star size={22} /> },
    { key: "gallery" as const, label: isArabic ? "قبل وبعد" : "Cases", icon: <SmilePlus size={22} /> },
    { key: "faq" as const, label: "FAQ", icon: <ClipboardCheck size={22} /> },
    { key: "seo" as const, label: "SEO", icon: <SearchCheck size={22} /> },
    { key: "media" as const, label: isArabic ? "الصور" : "Media", icon: <Sparkles size={22} /> },
  ];
  const operationLinks = [
    { key: "bookings" as const, label: isArabic ? "الحجوزات" : "Bookings", icon: <CalendarCheck size={22} /> },
    { key: "analytics" as const, label: isArabic ? "التحليلات" : "Analytics", icon: <SearchCheck size={22} /> },
    { key: "activity" as const, label: isArabic ? "النشاط" : "Activity", icon: <ClipboardCheck size={22} /> },
  ];
  const systemLinks = [
    { key: "users" as const, label: isArabic ? "المستخدمين" : "Users", icon: <UsersRound size={22} /> },
    { key: "import" as const, label: isArabic ? "استيراد" : "Import", icon: <ClipboardList size={22} /> },
    { key: "settings" as const, label: isArabic ? "الإعدادات" : "Settings", icon: <Stethoscope size={22} /> },
    { key: "security" as const, label: isArabic ? "الأمان" : "Security", icon: <Lock size={22} /> },
  ];
  const groups = [
    { key: "site", label: isArabic ? "إدارة الموقع" : "Site Management", items: siteLinks },
    { key: "operations", label: isArabic ? "إدارة العمليات" : "Operations", items: operationLinks },
    { key: "system", label: isArabic ? "النظام والصلاحيات" : "System", items: systemLinks },
  ];
  const activeGroupKey = groups.find((group) => group.items.some((item) => item.key === activeView))?.key || "site";
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    site: activeGroupKey === "site",
    operations: activeGroupKey === "operations",
    system: activeGroupKey === "system",
  });

  useEffect(() => {
    setOpenGroups((current) => ({ ...current, [activeGroupKey]: true }));
  }, [activeGroupKey]);

  function toggleGroup(groupKey: string) {
    setOpenGroups((current) => ({ ...current, [groupKey]: !current[groupKey] }));
  }

  return (
    <aside className="admin-sidebar" aria-label={isArabic ? "تنقل لوحة التحكم" : "Admin navigation"}>
      <div className="admin-sidebar-brand">
        <img src="/brand/logo-transparent.png" alt="Dr. Amr Elshamy" />
        {!collapsed ? <strong>{isArabic ? "لوحة الدكتور" : "Doctor Panel"}</strong> : null}
        <button className="admin-sidebar-collapse" type="button" onClick={onToggleCollapse} aria-label={isArabic ? "تصغير القائمة" : "Collapse sidebar"}>{collapsed ? "☰" : "×"}</button>
      </div>
      <nav>
        {groups.map((group) => (
          <div className={openGroups[group.key] ? "admin-nav-group open" : "admin-nav-group"} key={group.key}>
            <button
              className="admin-nav-group-title"
              type="button"
              onClick={() => toggleGroup(group.key)}
              aria-expanded={Boolean(openGroups[group.key])}
            >
              {!collapsed ? <span>{group.label}</span> : <span>{group.label.slice(0, 1)}</span>}
              <ChevronRight size={17} />
            </button>
            <div className="admin-nav-group-items">
              {group.items.filter((item) => allowedViews.has(item.key)).map((item) => (
                <button className={activeView === item.key ? "active" : ""} type="button" key={item.key} onClick={() => onNavigate(item.key)}>
                  {item.icon}
                  {!collapsed ? <span>{item.label}</span> : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <button className="admin-logout" type="button" onClick={onLogout}><LogOut size={18} /> {!collapsed ? (isArabic ? "خروج" : "Logout") : null}</button>
    </aside>
  );
}

function AdminOverview({ stats, isArabic }: { stats: { totalVisitors: number; publishedArticles: number; activeServices?: number; pendingReviews: number; draftArticles?: number; newBookings?: number; alerts?: string[] }; isArabic: boolean }) {
  const cards = [
    { label: isArabic ? "إجمالي الزوار" : "Total Visitors", value: stats.totalVisitors, icon: <UsersRound size={28} /> },
    { label: isArabic ? "مقالات منشورة" : "Published Articles", value: stats.publishedArticles, icon: <ClipboardList size={28} /> },
    { label: isArabic ? "خدمات نشطة" : "Active Services", value: stats.activeServices || 0, icon: <SmilePlus size={28} /> },
    { label: isArabic ? "آراء بانتظار الموافقة" : "Pending Reviews", value: stats.pendingReviews, icon: <Star size={28} /> },
    { label: isArabic ? "مقالات مسودة" : "Draft Articles", value: stats.draftArticles || 0, icon: <ClipboardCheck size={28} /> },
    { label: isArabic ? "حجوزات جديدة" : "New Bookings", value: stats.newBookings || 0, icon: <CalendarCheck size={28} /> },
  ];

  return (
    <>
      {stats.alerts?.length ? (
        <div className="admin-alert-strip">
          {stats.alerts.map((alert) => <span key={alert}>{alert}</span>)}
        </div>
      ) : null}
      <div className="admin-overview-grid">
        {cards.map((card) => (
          <article className="admin-kpi-card" key={card.label}>
            <span>{card.icon}</span>
            <strong>{card.value}</strong>
            <p>{card.label}</p>
          </article>
        ))}
      </div>
      <div className="admin-editor-actions admin-backup-row">
        <a className="secondary-button" href="/api/admin/export" target="_blank" rel="noreferrer">{isArabic ? "تحميل نسخة احتياطية JSON" : "Download JSON Backup"}</a>
      </div>
    </>
  );
}

type AdminArticle = {
  id: number;
  title: string;
  slug?: string | null;
  meta_description?: string | null;
  excerpt_ar?: string | null;
  excerpt_en?: string | null;
  cover_image?: string | null;
  body: string;
  conclusion: string;
  category?: string | null;
  author?: string | null;
  featured?: number | boolean | null;
  faq_items?: string | null;
  status: "published" | "draft";
  created_at?: string;
  updated_at?: string | null;
  publish_at?: string | null;
};

type ArticleFormState = {
  id?: number;
  title: string;
  slug: string;
  metaDescription: string;
  excerptAr: string;
  excerptEn: string;
  coverImage: string;
  body: string;
  blocks: ArticleBlock[];
  conclusion: string;
  category: string;
  author: string;
  featured: boolean;
  faqItems: Array<{ questionAr: string; questionEn: string; answerAr: string; answerEn: string }>;
  status: "published" | "draft";
  publishAt: string;
};

type ArticleBlockType = "paragraph" | "heading" | "image" | "video" | "divider" | "spacer";
type ArticleBlock = {
  id: string;
  type: ArticleBlockType;
  content: string;
  metadata?: {
    level?: 1 | 2 | 3;
    align?: "start" | "center" | "end";
    caption?: string;
    alt?: string;
    height?: number;
  };
};

const emptyArticleForm: ArticleFormState = {
  title: "",
  slug: "",
  metaDescription: "",
  excerptAr: "",
  excerptEn: "",
  coverImage: "",
  body: "",
  blocks: [{ id: "block-1", type: "paragraph", content: "", metadata: { align: "start" } }],
  conclusion: "",
  category: "Dental Implants",
  author: "Dr. Amr Elshamy",
  featured: false,
  faqItems: [
    { questionAr: "", questionEn: "", answerAr: "", answerEn: "" },
    { questionAr: "", questionEn: "", answerAr: "", answerEn: "" },
    { questionAr: "", questionEn: "", answerAr: "", answerEn: "" },
  ],
  status: "published",
  publishAt: "",
};

function parseArticleFaqItems(value?: string | null) {
  const empty = emptyArticleForm.faqItems.map((item) => ({ ...item }));
  if (!value) return empty;
  try {
    const parsed = JSON.parse(value) as ArticleFormState["faqItems"];
    if (!Array.isArray(parsed)) return empty;
    return [0, 1, 2].map((index) => ({
      questionAr: parsed[index]?.questionAr || "",
      questionEn: parsed[index]?.questionEn || "",
      answerAr: parsed[index]?.answerAr || "",
      answerEn: parsed[index]?.answerEn || "",
    }));
  } catch {
    return empty;
  }
}

function createArticleBlock(type: ArticleBlockType = "paragraph"): ArticleBlock {
  const base = { id: `block-${Date.now()}-${Math.random().toString(16).slice(2)}`, type, content: "" };
  if (type === "heading") return { ...base, metadata: { level: 2, align: "start" } };
  if (type === "spacer") return { ...base, metadata: { height: 32 } };
  if (type === "divider") return base;
  return { ...base, metadata: { align: "start" } };
}

function legacyBodyToBlocks(body: string): ArticleBlock[] {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean).map((block) => {
    const id = `block-${Math.random().toString(16).slice(2)}`;
    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) return { id, type: "image" as const, content: image[2], metadata: { caption: image[1], alt: image[1], align: "center" as const } };
    const video = block.match(/^\[video\]\(([^)]+)\)$/i);
    if (video) return { id, type: "video" as const, content: video[1], metadata: { align: "center" as const } };
    if (block.startsWith("## ")) return { id, type: "heading" as const, content: block.slice(3), metadata: { level: 2 as const, align: "start" as const } };
    if (block === "---") return { id, type: "divider" as const, content: "" };
    return { id, type: "paragraph" as const, content: block, metadata: { align: "start" as const } };
  });
  return blocks.length ? blocks : [createArticleBlock("paragraph")];
}

function parseArticleBlocks(body: string): ArticleBlock[] {
  try {
    const parsed = JSON.parse(body) as { blocks?: ArticleBlock[] } | ArticleBlock[];
    const blocks = Array.isArray(parsed) ? parsed : parsed.blocks;
    if (!Array.isArray(blocks)) return legacyBodyToBlocks(body);
    return blocks.map((block) => ({
      id: block.id || `block-${Math.random().toString(16).slice(2)}`,
      type: ["paragraph", "heading", "image", "video", "divider", "spacer"].includes(block.type) ? block.type : "paragraph",
      content: String(block.content || ""),
      metadata: block.metadata || {},
    }));
  } catch {
    return legacyBodyToBlocks(body);
  }
}

function serializeArticleBlocks(blocks: ArticleBlock[]) {
  return JSON.stringify({ version: 1, blocks });
}

const maxAdminUploadBytes = 2 * 1024 * 1024;
const allowedAdminImageTypes = ["image/jpeg", "image/png", "image/webp"];

async function compressImageForUpload(file: File) {
  if (file.type === "image/webp" && file.size <= maxAdminUploadBytes) return file;
  if (typeof document === "undefined" || typeof createImageBitmap === "undefined") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1600;
    const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
    bitmap.close();
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${name}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

async function uploadAdminImage(file: File | undefined, isArabic: boolean, setMessage: (message: string) => void) {
  if (!file) return "";
  if (!allowedAdminImageTypes.includes(file.type)) {
    setMessage(isArabic ? "صيغة الصورة لازم تكون JPG أو PNG أو WEBP." : "Image must be JPG, PNG, or WEBP.");
    return "";
  }

  setMessage(isArabic ? "جاري ضغط الصورة وتحويلها WebP..." : "Compressing image to WebP...");
  const optimizedFile = await compressImageForUpload(file);
  if (optimizedFile.size > maxAdminUploadBytes) {
    setMessage(isArabic ? "الصورة كبيرة بعد الضغط. اختار صورة أقل من 2 ميجابايت." : "Image is still too large after compression. Choose an image under 2MB.");
    return "";
  }

  const data = new FormData();
  data.append("file", optimizedFile);
  const response = await fetch("/api/admin/upload", { method: "POST", body: data });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setMessage(error.error || (isArabic ? "تعذر رفع الصورة." : "Could not upload image."));
    return "";
  }

  const payload = await response.json() as { url: string; watermarked?: boolean };
  setMessage(payload.watermarked ? (isArabic ? "تم رفع الصورة وإضافة الواترمارك بنجاح." : "Image uploaded with watermark successfully.") : (isArabic ? "تم رفع الصورة بنجاح." : "Image uploaded successfully."));
  return payload.url;
}

function AdminImageUrlField({
  label,
  value,
  onChange,
  isArabic,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isArabic: boolean;
}) {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File | undefined) {
    setUploading(true);
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (url) onChange(url);
    setUploading(false);
  }

  return (
    <label className="admin-image-url-field">
      <span>{label}</span>
      <div>
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={isArabic ? "رابط الصورة أو ارفع صورة" : "Image URL or upload an image"} />
        <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void upload(event.target.files?.[0])} />
      </div>
      {value ? <img src={value} alt="" loading="lazy" /> : null}
      {message ? <small className={uploading ? "" : "success-message"}>{message}</small> : null}
    </label>
  );
}

function isImageLikeField(key: string) {
  return /image|img|photo|logo|thumb|cover/i.test(key);
}

function BlockArticleEditor({ blocks, onChange, isArabic, setMessage }: { blocks: ArticleBlock[]; onChange: (blocks: ArticleBlock[]) => void; isArabic: boolean; setMessage: (message: string) => void }) {
  function updateBlock(index: number, updates: Partial<ArticleBlock>) {
    onChange(blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...updates, metadata: { ...block.metadata, ...updates.metadata } } : block));
  }

  function insertBlock(index: number, type: ArticleBlockType, after = true) {
    const next = [...blocks];
    next.splice(after ? index + 1 : index, 0, createArticleBlock(type));
    onChange(next);
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  }

  function deleteBlock(index: number) {
    const next = blocks.filter((_, blockIndex) => blockIndex !== index);
    onChange(next.length ? next : [createArticleBlock("paragraph")]);
  }

  async function uploadBlockImage(index: number, file: File | undefined) {
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (url) updateBlock(index, { content: url });
  }

  function applyInlineFormat(index: number, format: "bold" | "italic" | "link" | "list") {
    const block = blocks[index];
    const content = block.content || "";
    const additions = {
      bold: `**${isArabic ? "نص مهم" : "Important text"}**`,
      italic: `_${isArabic ? "نص مائل" : "Italic text"}_`,
      link: `[${isArabic ? "نص الرابط" : "Link text"}](https://example.com)`,
      list: `- ${isArabic ? "نقطة أولى" : "First point"}\n- ${isArabic ? "نقطة ثانية" : "Second point"}`,
    };
    updateBlock(index, { content: `${content}${content ? "\n" : ""}${additions[format]}` });
  }

  const addTypes: ArticleBlockType[] = ["paragraph", "heading", "image", "video", "divider", "spacer"];

  return (
    <div className="block-editor-shell">
      <div className="block-editor-title">
        <strong>{isArabic ? "محرر البلوكات" : "Block Editor"}</strong>
        <span>{isArabic ? "ابني المقال من بلوكات قابلة للترتيب." : "Build the article from sortable content blocks."}</span>
      </div>
      <div className="block-list">
        {blocks.map((block, index) => (
          <article className={`content-block block-${block.type}`} key={block.id}>
            <div className="block-floating-toolbar">
              <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0}>↑</button>
              <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}>↓</button>
              <select value={block.type} onChange={(event) => updateBlock(index, createArticleBlock(event.target.value as ArticleBlockType))}>
                <option value="paragraph">{isArabic ? "فقرة" : "Paragraph"}</option>
                <option value="heading">{isArabic ? "عنوان" : "Heading"}</option>
                <option value="image">{isArabic ? "صورة" : "Image"}</option>
                <option value="video">{isArabic ? "فيديو" : "Video"}</option>
                <option value="divider">{isArabic ? "فاصل" : "Divider"}</option>
                <option value="spacer">{isArabic ? "مسافة" : "Spacer"}</option>
              </select>
              <div className="block-plus-menu">
                <button type="button">+</button>
                <div>
                  {addTypes.map((type) => <button type="button" key={type} onClick={() => insertBlock(index, type)}>{type}</button>)}
                </div>
              </div>
              <button className="danger" type="button" onClick={() => deleteBlock(index)}>×</button>
            </div>

            {block.type === "heading" ? (
              <>
                <div className="block-inline-controls">
                  <select value={block.metadata?.level || 2} onChange={(event) => updateBlock(index, { metadata: { level: Number(event.target.value) as 1 | 2 | 3 } })}>
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                  </select>
                  <select value={block.metadata?.align || "start"} onChange={(event) => updateBlock(index, { metadata: { align: event.target.value as "start" | "center" | "end" } })}>
                    <option value="start">{isArabic ? "بداية" : "Start"}</option>
                    <option value="center">{isArabic ? "منتصف" : "Center"}</option>
                    <option value="end">{isArabic ? "نهاية" : "End"}</option>
                  </select>
                </div>
                <input className={`block-heading-input align-${block.metadata?.align || "start"}`} value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} placeholder={isArabic ? "اكتب عنوان البلوك" : "Write a block heading"} />
              </>
            ) : null}

            {block.type === "paragraph" ? (
              <>
                <div className="block-inline-controls">
                  {(["bold", "italic", "link", "list"] as const).map((format) => <button type="button" key={format} onClick={() => applyInlineFormat(index, format)}>{format}</button>)}
                  <select value={block.metadata?.align || "start"} onChange={(event) => updateBlock(index, { metadata: { align: event.target.value as "start" | "center" | "end" } })}>
                    <option value="start">{isArabic ? "بداية" : "Start"}</option>
                    <option value="center">{isArabic ? "منتصف" : "Center"}</option>
                    <option value="end">{isArabic ? "نهاية" : "End"}</option>
                  </select>
                </div>
                <textarea className={`block-paragraph-input align-${block.metadata?.align || "start"}`} value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} placeholder={isArabic ? "اكتب فقرة المقال هنا" : "Write article paragraph here"} />
              </>
            ) : null}

            {block.type === "image" ? (
              <div className="block-media-editor">
                {block.content ? <img src={block.content} alt={block.metadata?.alt || ""} /> : <div className="block-media-placeholder"><ImageIcon size={26} /></div>}
                <AdminImageUrlField label={isArabic ? "رابط/رفع الصورة" : "Image upload / URL"} value={block.content} onChange={(value) => updateBlock(index, { content: value })} isArabic={isArabic} />
                <input value={block.metadata?.caption || ""} onChange={(event) => updateBlock(index, { metadata: { caption: event.target.value } })} placeholder={isArabic ? "Caption الصورة" : "Image caption"} />
                <input value={block.metadata?.alt || ""} onChange={(event) => updateBlock(index, { metadata: { alt: event.target.value } })} placeholder={isArabic ? "Alt text" : "Alt text"} />
                <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void uploadBlockImage(index, event.target.files?.[0])} />
              </div>
            ) : null}

            {block.type === "video" ? (
              <div className="block-media-editor">
                <input value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} placeholder="YouTube / Vimeo URL" />
                {block.content ? <div className="article-video-embed"><iframe src={videoEmbedUrl(block.content)} title="Video preview" loading="lazy" allowFullScreen /></div> : null}
              </div>
            ) : null}

            {block.type === "divider" ? <hr className="block-divider-preview" /> : null}
            {block.type === "spacer" ? (
              <label className="block-spacer-control">
                <span>{isArabic ? "ارتفاع المسافة" : "Spacer height"}</span>
                <input type="range" min={16} max={120} value={block.metadata?.height || 32} onChange={(event) => updateBlock(index, { metadata: { height: Number(event.target.value) } })} />
              </label>
            ) : null}
          </article>
        ))}
      </div>
      <div className="block-editor-add-row">
        {addTypes.map((type) => <button type="button" key={type} onClick={() => insertBlock(blocks.length - 1, type)}>{isArabic ? `إضافة ${type}` : `Add ${type}`}</button>)}
      </div>
    </div>
  );
}

function ArticlesManager({ isArabic, onStatsChange }: { isArabic: boolean; onStatsChange: () => Promise<void> }) {
  const [items, setItems] = useState<AdminArticle[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState<ArticleFormState>(emptyArticleForm);
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState("");
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  async function loadArticles(nextPage = page) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(nextPage), pageSize: String(pageSize), status, search });
    const response = await fetch(`/api/admin/articles?${params.toString()}`);
    if (response.ok) {
      const payload = await response.json() as { items: AdminArticle[]; total: number };
      setItems(payload.items);
      setTotal(payload.total);
      setMessage("");
    } else {
      setMessage(isArabic ? "تعذر تحميل المقالات." : "Could not load articles.");
    }
    setLoading(false);
  }

  useEffect(() => {
    setPage(1);
    void loadArticles(1);
  }, [search, status]);

  async function submitArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const articlePayload = { ...form, body: serializeArticleBlocks(form.blocks) };
    const response = await fetch("/api/admin/articles", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articlePayload),
    });

    if (response.ok) {
      setForm(emptyArticleForm);
      setMessage(isArabic ? "تم حفظ المقال بنجاح." : "Article saved successfully.");
      await loadArticles(page);
      await onStatsChange();
      refreshAdminLivePreview();
    } else {
      const error = await response.json().catch(() => ({}));
      setMessage(error.error || (isArabic ? "تعذر حفظ المقال." : "Could not save article."));
    }
    setLoading(false);
  }

  async function deleteArticle(id: number) {
    setLoading(true);
    const response = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      await loadArticles(page);
      await onStatsChange();
      refreshAdminLivePreview();
    }
    setLoading(false);
  }

  function editArticle(article: AdminArticle) {
    setForm({
      id: article.id,
      title: article.title,
      slug: article.slug || "",
      metaDescription: article.meta_description || "",
      excerptAr: article.excerpt_ar || article.meta_description || "",
      excerptEn: article.excerpt_en || "",
      coverImage: article.cover_image || "",
      body: article.body,
      blocks: parseArticleBlocks(article.body),
      conclusion: article.conclusion,
      category: article.category || "Dental Implants",
      author: article.author || "Dr. Amr Elshamy",
      featured: Boolean(article.featured),
      faqItems: parseArticleFaqItems(article.faq_items),
      status: article.status === "draft" ? "draft" : "published",
      publishAt: article.publish_at || "",
    });
  }

  async function handleCoverUpload(file: File | undefined) {
    setUploadingCover(true);
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (url) setForm((current) => ({ ...current, coverImage: url }));
    setUploadingCover(false);
  }

  function appendToArticleBody(snippet: string) {
    setForm((current) => ({
      ...current,
      body: `${current.body}${current.body.trim() ? "\n\n" : ""}${snippet}`,
      blocks: [...current.blocks, { ...createArticleBlock(snippet.startsWith("##") ? "heading" : snippet.startsWith("[video]") ? "video" : "paragraph"), content: snippet.replace(/^##\s*/, "").replace(/^\[video\]\(([^)]+)\)$/i, "$1") }],
    }));
  }

  async function handleArticleImageUpload(file: File | undefined) {
    setUploadingCover(true);
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (url) appendToArticleBody(`![${isArabic ? "صورة داخل المقال" : "Article image"}](${url})`);
    setUploadingCover(false);
  }

  const richTools = [
    { label: isArabic ? "عنوان فرعي" : "Subheading", snippet: `## ${isArabic ? "عنوان فرعي" : "Subheading"}` },
    { label: "Bold", snippet: `**${isArabic ? "نص مهم" : "Important text"}**` },
    { label: isArabic ? "قائمة نقط" : "Bullet list", snippet: `- ${isArabic ? "نقطة أولى" : "First point"}\n- ${isArabic ? "نقطة ثانية" : "Second point"}` },
    { label: isArabic ? "رابط" : "Link", snippet: `[${isArabic ? "نص الرابط" : "Link text"}](https://example.com)` },
    { label: isArabic ? "فيديو" : "Video", snippet: `[video](https://www.youtube.com/watch?v=VIDEO_ID)` },
    { label: isArabic ? "ملاحظة" : "Note", snippet: `> ${isArabic ? "معلومة مهمة للمريض" : "Important note for the patient"}` },
  ];

  function updateFaq(index: number, key: keyof ArticleFormState["faqItems"][number], value: string) {
    setForm((current) => ({
      ...current,
      faqItems: current.faqItems.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  }

  return (
    <div className="admin-workspace-grid">
      <section className="admin-table-card">
        <div className="admin-tools-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isArabic ? "ابحث بعنوان المقال" : "Search by title"} />
          <select value={status} onChange={(event) => setStatus(event.target.value as "all" | "published" | "draft")}>
            <option value="all">{isArabic ? "كل الحالات" : "All statuses"}</option>
            <option value="published">{isArabic ? "منشور" : "Published"}</option>
            <option value="draft">{isArabic ? "مسودة" : "Draft"}</option>
          </select>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>{isArabic ? "العنوان" : "Title"}</th>
                <th>{isArabic ? "الحالة" : "Status"}</th>
                <th>{isArabic ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((article) => (
                <tr key={article.id}>
                  <td>
                    <strong>{article.title}</strong>
                    <small>{article.created_at ? new Date(article.created_at).toLocaleDateString() : ""}</small>
                  </td>
                  <td><AdminStatusBadge status={article.status} isArabic={isArabic} /></td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => editArticle(article)}>{isArabic ? "تعديل" : "Edit"}</button>
                      <button className="danger" type="button" onClick={() => void deleteArticle(article.id)}>{isArabic ? "حذف" : "Delete"}</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length ? <tr><td colSpan={3}>{loading ? (isArabic ? "جاري التحميل..." : "Loading...") : (isArabic ? "لا توجد مقالات." : "No articles found.")}</td></tr> : null}
            </tbody>
          </table>
        </div>
        <AdminPagination page={page} totalPages={totalPages} isArabic={isArabic} onPageChange={(next) => { setPage(next); void loadArticles(next); }} />
      </section>

      <section className="admin-editor-card">
        <h3>{form.id ? (isArabic ? "تعديل مقال" : "Edit Article") : (isArabic ? "مقال جديد" : "New Article")}</h3>
        <form className="admin-form admin-editor-form" onSubmit={submitArticle}>
          <div className="article-editor-section">
            <strong>{isArabic ? "1. عنوان المقال" : "1. Article Title"}</strong>
            <label>
              <span>{isArabic ? "عنوان المقال" : "Article title"}</span>
              <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </label>
            <label>
              <span>{isArabic ? "رابط المقال SEO" : "SEO slug"}</span>
              <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder={isArabic ? "اتركه فارغًا للتوليد التلقائي" : "Leave empty to auto-generate"} />
            </label>
          </div>
          <label>
            <span>{isArabic ? "وصف محركات البحث" : "Meta description"}</span>
            <textarea
              maxLength={160}
              value={form.metaDescription}
              onChange={(event) => setForm({ ...form, metaDescription: event.target.value })}
              placeholder={isArabic ? "وصف مختصر يظهر في نتائج البحث" : "Short search result snippet"}
            />
            <small className="admin-character-count">{form.metaDescription.length}/160</small>
          </label>
          <div className="admin-quick-grid compact">
            <label>
              <span>{isArabic ? "وصف مختصر عربي" : "Arabic excerpt"}</span>
              <textarea value={form.excerptAr} onChange={(event) => setForm({ ...form, excerptAr: event.target.value })} />
            </label>
            <label>
              <span>{isArabic ? "وصف مختصر إنجليزي" : "English excerpt"}</span>
              <textarea value={form.excerptEn} onChange={(event) => setForm({ ...form, excerptEn: event.target.value })} placeholder={isArabic ? "لو فاضي الموقع يستخدم العربي" : "Arabic is used when empty"} />
            </label>
            <label>
              <span>{isArabic ? "التصنيف" : "Category"}</span>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                <option value="Dental Implants">{isArabic ? "زراعة الأسنان" : "Dental Implants"}</option>
                <option value="Cosmetic">{isArabic ? "تجميل الأسنان" : "Cosmetic"}</option>
                <option value="Root Canal">{isArabic ? "علاج العصب" : "Root Canal"}</option>
                <option value="Pediatric">{isArabic ? "أسنان الأطفال" : "Pediatric"}</option>
                <option value="Clinic Tips">{isArabic ? "نصائح العيادة" : "Clinic Tips"}</option>
              </select>
            </label>
            <label>
              <span>{isArabic ? "الكاتب" : "Author"}</span>
              <select value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })}>
                <option value="Dr. Amr Elshamy">Dr. Amr Elshamy</option>
                <option value="Clinic">{isArabic ? "العيادة" : "Clinic"}</option>
              </select>
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
              <span>{isArabic ? "مقال مميز" : "Featured article"}</span>
            </label>
          </div>
          <label className="admin-file-field">
            <span>{isArabic ? "صورة الغلاف فقط" : "Cover image only"}</span>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void handleCoverUpload(event.target.files?.[0])} />
          </label>
          {form.coverImage ? (
            <div className="admin-cover-preview-wrap">
              <img className="admin-cover-preview" src={form.coverImage} alt="Article cover preview" />
              <div className="admin-preview-actions">
                <button type="button" onClick={() => setForm((current) => ({ ...current, coverImage: "" }))}>{isArabic ? "حذف صورة الغلاف" : "Remove cover"}</button>
                {form.id && form.slug ? <a href={`/blog/${form.slug}`} target="_blank" rel="noreferrer">{isArabic ? "فتح المقال" : "Open article"}</a> : null}
              </div>
            </div>
          ) : null}
          <BlockArticleEditor
            blocks={form.blocks}
            isArabic={isArabic}
            setMessage={setMessage}
            onChange={(blocks) => setForm((current) => ({ ...current, blocks, body: serializeArticleBlocks(blocks) }))}
          />
          <div className="article-editor-section article-footer-editor">
            <strong>{isArabic ? "3. فوتر المقالة" : "3. Article Footer"}</strong>
            <label>
              <span>{isArabic ? "نص يظهر في آخر المقال" : "Text shown at the end of the article"}</span>
              <textarea value={form.conclusion} onChange={(event) => setForm({ ...form, conclusion: event.target.value })} placeholder={isArabic ? "مثال: لو عندك سؤال عن حالتك، احجز كشف بسيط وهنشرح لك الخطة المناسبة." : "Example: If you have a question about your case, book a checkup and we will explain the right plan."} />
            </label>
          </div>
          <div className="article-editor-section">
            <strong>{isArabic ? "4. أسئلة المقال" : "4. Article FAQs"}</strong>
            {form.faqItems.map((faq, index) => (
              <div className="admin-quick-grid compact" key={index}>
                <input value={faq.questionAr} onChange={(event) => updateFaq(index, "questionAr", event.target.value)} placeholder={isArabic ? `سؤال ${index + 1} عربي` : `FAQ ${index + 1} Arabic question`} />
                <input value={faq.questionEn} onChange={(event) => updateFaq(index, "questionEn", event.target.value)} placeholder={isArabic ? `سؤال ${index + 1} إنجليزي` : `FAQ ${index + 1} English question`} />
                <textarea value={faq.answerAr} onChange={(event) => updateFaq(index, "answerAr", event.target.value)} placeholder={isArabic ? "إجابة عربي" : "Arabic answer"} />
                <textarea value={faq.answerEn} onChange={(event) => updateFaq(index, "answerEn", event.target.value)} placeholder={isArabic ? "إجابة إنجليزي" : "English answer"} />
              </div>
            ))}
          </div>
          <label>
            <span>{isArabic ? "حالة المقال" : "Article status"}</span>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "published" | "draft" })}>
              <option value="published">{isArabic ? "منشور" : "Published"}</option>
              <option value="draft">{isArabic ? "مسودة" : "Draft"}</option>
            </select>
          </label>
          <label>
            <span>{isArabic ? "جدولة النشر" : "Schedule publishing"}</span>
            <input type="datetime-local" value={form.publishAt} onChange={(event) => setForm({ ...form, publishAt: event.target.value })} />
          </label>
          {message ? <p className="admin-form-message">{message}</p> : null}
          <div className="admin-editor-actions">
            <button className="primary-button" type="submit" disabled={loading || uploadingCover}>{loading ? (isArabic ? "جاري الحفظ..." : "Saving...") : uploadingCover ? (isArabic ? "جاري رفع الصورة..." : "Uploading image...") : (isArabic ? "حفظ المقال" : "Save Article")}</button>
            <button className="secondary-button" type="button" onClick={() => setPreviewOpen(true)}>{isArabic ? "معاينة المقال" : "Preview Article"}</button>
            {form.id ? <button className="secondary-button" type="button" onClick={() => setForm(emptyArticleForm)}>{isArabic ? "إلغاء" : "Cancel"}</button> : null}
          </div>
        </form>
      </section>
      {previewOpen ? <ArticlePreviewModal form={form} isArabic={isArabic} onClose={() => setPreviewOpen(false)} /> : null}
    </div>
  );
}

function ArticlePreviewModal({ form, isArabic, onClose }: { form: ArticleFormState; isArabic: boolean; onClose: () => void }) {
  return (
    <div className="admin-preview-modal-overlay" role="dialog" aria-modal="true">
      <article className="admin-preview-modal">
        <button className="close-button" type="button" onClick={onClose} aria-label={isArabic ? "إغلاق المعاينة" : "Close preview"}><X size={20} /></button>
        <p className="section-label">{isArabic ? "معاينة قبل النشر" : "Preview before publishing"}</p>
        <h2>{form.title || (isArabic ? "عنوان المقال" : "Article title")}</h2>
        {form.metaDescription ? <p className="article-summary">{form.metaDescription}</p> : null}
        {form.coverImage ? <img className="article-detail-cover" src={form.coverImage} alt="" /> : null}
        <div className="article-content">
          {renderArticleContent(serializeArticleBlocks(form.blocks))}
        </div>
        {form.conclusion ? (
          <footer className="article-footer-note">
            <span>{isArabic ? "فوتر المقال" : "Article Footer"}</span>
            <strong>{form.conclusion}</strong>
          </footer>
        ) : null}
      </article>
    </div>
  );
}

function renderInlineArticleText(text: string) {
  const pattern = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern).filter(Boolean);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={`${part}-${index}`}>{bold[1]}</strong>;
    const italic = part.match(/^_([^_]+)_$/);
    if (italic) return <em key={`${part}-${index}`}>{italic[1]}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a href={link[2]} target="_blank" rel="noreferrer" key={`${part}-${index}`}>{link[1]}</a>;
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function videoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    if (parsed.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${parsed.pathname.replace("/", "")}`;
    return url;
  } catch {
    return url;
  }
}

function renderArticleContent(body: string) {
  const maybeBlocks = parseArticleBlocks(body);
  if (body.trim().startsWith("{") || body.trim().startsWith("[")) {
    return maybeBlocks.map((block) => renderArticleBlock(block));
  }

  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return blocks.map((block, index) => {
    const video = block.match(/^\[video\]\(([^)]+)\)$/i);
    if (video) {
      return (
        <div className="article-video-embed" key={`${video[1]}-${index}`}>
          <iframe src={videoEmbedUrl(video[1])} title="Article video" loading="lazy" allowFullScreen />
        </div>
      );
    }

    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      return (
        <figure className="article-inline-image" key={`${image[2]}-${index}`}>
          <img src={image[2]} alt={image[1]} loading="lazy" />
          {image[1] ? <figcaption>{image[1]}</figcaption> : null}
        </figure>
      );
    }

    if (block.startsWith("## ")) {
      return <h2 key={`${block}-${index}`}>{renderInlineArticleText(block.slice(3))}</h2>;
    }

    if (block.startsWith("> ")) {
      return <blockquote key={`${block}-${index}`}>{renderInlineArticleText(block.replace(/^>\s*/, ""))}</blockquote>;
    }

    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length && lines.every((line) => line.startsWith("- "))) {
      return (
        <ul key={`${block}-${index}`}>
          {lines.map((line) => <li key={line}>{renderInlineArticleText(line.slice(2))}</li>)}
        </ul>
      );
    }

    return <p key={`${block}-${index}`}>{renderInlineArticleText(block)}</p>;
  });
}

function renderArticleBlock(block: ArticleBlock) {
  const alignClass = `align-${block.metadata?.align || "start"}`;
  if (block.type === "heading") {
    const level = block.metadata?.level || 2;
    if (level === 1) return <h1 className={alignClass} key={block.id}>{renderInlineArticleText(block.content)}</h1>;
    if (level === 3) return <h3 className={alignClass} key={block.id}>{renderInlineArticleText(block.content)}</h3>;
    return <h2 className={alignClass} key={block.id}>{renderInlineArticleText(block.content)}</h2>;
  }
  if (block.type === "image") {
    return (
      <figure className="article-inline-image" key={block.id}>
        <img src={block.content} alt={block.metadata?.alt || block.metadata?.caption || ""} loading="lazy" />
        {block.metadata?.caption ? <figcaption>{block.metadata.caption}</figcaption> : null}
      </figure>
    );
  }
  if (block.type === "video") {
    return (
      <div className="article-video-embed" key={block.id}>
        <iframe src={videoEmbedUrl(block.content)} title="Article video" loading="lazy" allowFullScreen />
      </div>
    );
  }
  if (block.type === "divider") return <hr className="article-divider" key={block.id} />;
  if (block.type === "spacer") return <div className="article-spacer" style={{ height: block.metadata?.height || 32 }} key={block.id} />;

  const lines = block.content.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length && lines.every((line) => line.startsWith("- "))) {
    return <ul className={alignClass} key={block.id}>{lines.map((line) => <li key={line}>{renderInlineArticleText(line.slice(2))}</li>)}</ul>;
  }
  return <p className={alignClass} key={block.id}>{renderInlineArticleText(block.content)}</p>;
}

type AdminReview = {
  id: number;
  name: string;
  rating: number;
  message: string;
  status: "pending" | "approved" | "published" | "rejected";
  created_at?: string;
};

function ReviewsManager({ isArabic, onStatsChange }: { isArabic: boolean; onStatsChange: () => Promise<void> }) {
  const [items, setItems] = useState<AdminReview[]>([]);
  const [status, setStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 7;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  async function loadReviews(nextPage = page) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(nextPage), pageSize: String(pageSize), status });
    const response = await fetch(`/api/admin/reviews?${params.toString()}`);
    if (response.ok) {
      const payload = await response.json() as { items: AdminReview[]; total: number };
      setItems(payload.items);
      setTotal(payload.total);
    }
    setLoading(false);
  }

  useEffect(() => {
    setPage(1);
    void loadReviews(1);
  }, [status]);

  async function updateStatus(id: number, nextStatus: "approved" | "rejected") {
    setLoading(true);
    const response = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    if (response.ok) {
      await loadReviews(page);
      await onStatsChange();
      refreshAdminLivePreview();
    }
    setLoading(false);
  }

  return (
    <section className="admin-table-card admin-reviews-manager">
      <div className="admin-tools-row">
        <select value={status} onChange={(event) => setStatus(event.target.value as "all" | "pending" | "approved" | "rejected")}>
          <option value="all">{isArabic ? "كل الآراء" : "All reviews"}</option>
          <option value="pending">{isArabic ? "بانتظار الموافقة" : "Pending"}</option>
          <option value="approved">{isArabic ? "موافق عليه" : "Approved"}</option>
          <option value="rejected">{isArabic ? "مرفوض" : "Rejected"}</option>
        </select>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>{isArabic ? "المريض" : "Patient"}</th>
              <th>{isArabic ? "التقييم" : "Rating"}</th>
              <th>{isArabic ? "الرأي" : "Review"}</th>
              <th>{isArabic ? "الحالة" : "Status"}</th>
              <th>{isArabic ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((review) => (
              <tr key={review.id}>
                <td><strong>{review.name}</strong></td>
                <td><span className="admin-stars">{"★".repeat(review.rating)}</span></td>
                <td>{review.message}</td>
                <td><AdminStatusBadge status={review.status === "published" ? "approved" : review.status} isArabic={isArabic} /></td>
                <td>
                  <div className="admin-row-actions">
                    <button className="approve" type="button" disabled={loading} onClick={() => void updateStatus(review.id, "approved")}>{isArabic ? "موافقة" : "Approve"}</button>
                    <button className="danger" type="button" disabled={loading} onClick={() => void updateStatus(review.id, "rejected")}>{isArabic ? "رفض" : "Reject"}</button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length ? <tr><td colSpan={5}>{loading ? (isArabic ? "جاري التحميل..." : "Loading...") : (isArabic ? "لا توجد مراجعات." : "No reviews found.")}</td></tr> : null}
          </tbody>
        </table>
      </div>
      <AdminPagination page={page} totalPages={totalPages} isArabic={isArabic} onPageChange={(next) => { setPage(next); void loadReviews(next); }} />
    </section>
  );
}

type AdminGalleryItem = {
  id: number;
  title: string;
  category: string;
  image?: string;
  before_image?: string | null;
  after_image?: string | null;
  duration?: string | null;
  featured?: number | boolean | null;
  status: "published" | "draft";
  publish_at?: string | null;
};

type GalleryFormState = {
  id?: number;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  featured: boolean;
  status: "published" | "draft";
  publishAt: string;
};

const emptyGalleryForm: GalleryFormState = {
  title: "",
  category: "",
  beforeImage: "",
  afterImage: "",
  duration: "",
  featured: false,
  status: "published",
  publishAt: "",
};

function GalleryManager({ isArabic }: { isArabic: boolean }) {
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState<GalleryFormState>(emptyGalleryForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"before" | "after" | "">("");
  const [message, setMessage] = useState("");
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  async function loadCases(nextPage = page) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(nextPage), pageSize: String(pageSize), status, search });
    const response = await fetch(`/api/admin/gallery?${params.toString()}`);
    if (response.ok) {
      const payload = await response.json() as { items: AdminGalleryItem[]; total: number };
      setItems(payload.items);
      setTotal(payload.total);
      setMessage("");
    } else {
      setMessage(isArabic ? "تعذر تحميل الحالات." : "Could not load cases.");
    }
    setLoading(false);
  }

  useEffect(() => {
    setPage(1);
    void loadCases(1);
  }, [search, status]);

  function editCase(item: AdminGalleryItem) {
    setForm({
      id: item.id,
      title: item.title,
      category: item.category || "",
      beforeImage: item.before_image || "",
      afterImage: item.after_image || item.image || "",
      duration: item.duration || "",
      featured: Boolean(item.featured),
      status: item.status === "draft" ? "draft" : "published",
      publishAt: item.publish_at || "",
    });
  }

  async function handleCaseUpload(kind: "before" | "after", file: File | undefined) {
    setUploading(kind);
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (url) {
      setForm((current) => kind === "before" ? { ...current, beforeImage: url } : { ...current, afterImage: url });
    }
    setUploading("");
  }

  async function submitCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/admin/gallery", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setForm(emptyGalleryForm);
      setMessage(isArabic ? "تم حفظ الحالة بنجاح." : "Case saved successfully.");
      await loadCases(page);
      refreshAdminLivePreview();
    } else {
      const error = await response.json().catch(() => ({}));
      setMessage(error.error || (isArabic ? "تعذر حفظ الحالة." : "Could not save case."));
    }
    setLoading(false);
  }

  async function deleteCase(id: number) {
    setLoading(true);
    const response = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      await loadCases(page);
      setMessage(isArabic ? "تم حذف الحالة." : "Case deleted.");
      refreshAdminLivePreview();
    }
    setLoading(false);
  }

  return (
    <div className="admin-workspace-grid">
      <section className="admin-table-card">
        <div className="admin-tools-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isArabic ? "ابحث باسم الحالة" : "Search cases"} />
          <select value={status} onChange={(event) => setStatus(event.target.value as "all" | "published" | "draft")}>
            <option value="all">{isArabic ? "كل الحالات" : "All statuses"}</option>
            <option value="published">{isArabic ? "منشورة" : "Published"}</option>
            <option value="draft">{isArabic ? "مسودة" : "Draft"}</option>
          </select>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>{isArabic ? "الحالة" : "Case"}</th>
                <th>{isArabic ? "الصور" : "Images"}</th>
                <th>{isArabic ? "الحالة" : "Status"}</th>
                <th>{isArabic ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <small>{item.category}{item.duration ? ` · ${item.duration}` : ""}</small>
                  </td>
                  <td>
                    <div className="admin-case-thumbs">
                      {(item.before_image || item.image) ? <img src={item.before_image || item.image} alt="" loading="lazy" /> : null}
                      {(item.after_image || item.image) ? <img src={item.after_image || item.image} alt="" loading="lazy" /> : null}
                    </div>
                  </td>
                  <td><AdminStatusBadge status={item.status} isArabic={isArabic} /></td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => editCase(item)}>{isArabic ? "تعديل" : "Edit"}</button>
                      <button className="danger" type="button" onClick={() => void deleteCase(item.id)}>{isArabic ? "حذف" : "Delete"}</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length ? <tr><td colSpan={4}>{loading ? (isArabic ? "جاري التحميل..." : "Loading...") : (isArabic ? "لا توجد حالات." : "No cases found.")}</td></tr> : null}
            </tbody>
          </table>
        </div>
        <AdminPagination page={page} totalPages={totalPages} isArabic={isArabic} onPageChange={(next) => { setPage(next); void loadCases(next); }} />
      </section>

      <section className="admin-editor-card">
        <h3>{form.id ? (isArabic ? "تعديل حالة" : "Edit Case") : (isArabic ? "حالة جديدة" : "New Case")}</h3>
        <form className="admin-form admin-editor-form" onSubmit={submitCase}>
          <label>
            <span>{isArabic ? "اسم الحالة" : "Case title"}</span>
            <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </label>
          <label>
            <span>{isArabic ? "نوع العلاج" : "Treatment type"}</span>
            <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder={isArabic ? "مثال: زراعة الأسنان" : "Example: Dental implants"} />
          </label>
          <label>
            <span>{isArabic ? "مدة العلاج" : "Treatment duration"}</span>
            <input value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} placeholder={isArabic ? "مثال: 3 جلسات" : "Example: 3 visits"} />
          </label>
          <div className="admin-preview-pair">
            <label className="admin-file-field">
              <span>{isArabic ? "صورة قبل" : "Before image"}</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void handleCaseUpload("before", event.target.files?.[0])} />
              {form.beforeImage ? <img className="admin-upload-preview" src={form.beforeImage} alt="" /> : null}
            </label>
            <label className="admin-file-field">
              <span>{isArabic ? "صورة بعد" : "After image"}</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void handleCaseUpload("after", event.target.files?.[0])} />
              {form.afterImage ? <img className="admin-upload-preview" src={form.afterImage} alt="" /> : null}
            </label>
          </div>
          <label className="admin-check">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
            <span>{isArabic ? "إظهار الحالة كمميزة في الصفحة الرئيسية" : "Feature this case on the homepage"}</span>
          </label>
          <label>
            <span>{isArabic ? "حالة العرض" : "Display status"}</span>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "published" | "draft" })}>
              <option value="published">{isArabic ? "منشورة" : "Published"}</option>
              <option value="draft">{isArabic ? "مسودة" : "Draft"}</option>
            </select>
          </label>
          <label>
            <span>{isArabic ? "جدولة النشر" : "Schedule publishing"}</span>
            <input type="datetime-local" value={form.publishAt} onChange={(event) => setForm({ ...form, publishAt: event.target.value })} />
          </label>
          {message ? <p className="admin-form-message">{uploading ? (isArabic ? "جاري رفع الصورة..." : "Uploading image...") : message}</p> : null}
          <div className="admin-editor-actions">
            <button className="primary-button" type="submit" disabled={loading || Boolean(uploading)}>{loading ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "حفظ الحالة" : "Save Case")}</button>
            {form.id ? <button className="secondary-button" type="button" onClick={() => setForm(emptyGalleryForm)}>{isArabic ? "إلغاء" : "Cancel"}</button> : null}
          </div>
        </form>
      </section>
    </div>
  );
}

function SettingsManager({ isArabic }: { isArabic: boolean }) {
  const [form, setForm] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSettings() {
    setLoading(true);
    const response = await fetch("/api/admin/settings");
    if (response.ok) {
      setForm({ ...defaultSiteSettings, ...(await response.json() as SiteSettings) });
      setMessage("");
    } else {
      setMessage(isArabic ? "تعذر تحميل الإعدادات." : "Could not load settings.");
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  async function submitSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setMessage(isArabic ? "تم حفظ إعدادات الموقع بنجاح." : "Site settings saved successfully.");
      refreshAdminLivePreview();
    } else {
      const error = await response.json().catch(() => ({}));
      setMessage(error.error || (isArabic ? "تعذر حفظ الإعدادات." : "Could not save settings."));
    }
    setSaving(false);
  }

  const fields: Array<{ key: keyof SiteSettings; ar: string; en: string; type?: string }> = [
    { key: "phonePrimary", ar: "رقم الهاتف الأول", en: "Primary phone" },
    { key: "phoneSecondary", ar: "رقم الهاتف الثاني", en: "Secondary phone" },
    { key: "whatsappPhone", ar: "رقم واتساب بدون +", en: "WhatsApp phone without +" },
    { key: "email", ar: "البريد الإلكتروني", en: "Email", type: "email" },
    { key: "facebookUrl", ar: "رابط فيسبوك", en: "Facebook URL", type: "url" },
    { key: "instagramUrl", ar: "رابط إنستجرام", en: "Instagram URL", type: "url" },
    { key: "tiktokUrl", ar: "رابط تيك توك", en: "TikTok URL", type: "url" },
    { key: "mapUrl", ar: "رابط Google Maps", en: "Google Maps URL", type: "url" },
  ];

  return (
    <section className="admin-editor-card admin-settings-card">
      <h3>{isArabic ? "إعدادات التواصل والسوشيال" : "Contact & Social Settings"}</h3>
      <p>{isArabic ? "غيّر الأرقام والروابط من هنا بدل تعديلها داخل الكود." : "Update phone numbers and social links here without touching code."}</p>
      <form className="admin-form admin-settings-grid" onSubmit={submitSettings}>
        {fields.map((field) => (
          <label key={field.key}>
            <span>{isArabic ? field.ar : field.en}</span>
            <input
              type={field.type || "text"}
              disabled={loading}
              value={form[field.key]}
              onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
            />
          </label>
        ))}
        {message ? <p className="admin-form-message">{message}</p> : null}
        <div className="admin-editor-actions">
          <button className="primary-button" type="submit" disabled={loading || saving}>{saving ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "حفظ الإعدادات" : "Save Settings")}</button>
          <button className="secondary-button" type="button" disabled={loading || saving} onClick={() => void loadSettings()}>{isArabic ? "إعادة تحميل" : "Reload"}</button>
        </div>
      </form>
    </section>
  );
}

type ControlConfig = {
  siteText: Record<string, string>;
  heroConfig: HeroConfig;
  themeConfig: ThemeConfig;
  layoutConfig: LayoutConfig;
  headerFooterConfig: HeaderFooterConfig;
  bannerConfig: BannerConfig;
  formConfig: FormConfig;
  languageOverrides: Record<string, string>;
  scriptsConfig: ScriptsConfig;
  builderConfig: BuilderConfig;
};

function ControlCenterManager({ isArabic }: { isArabic: boolean }) {
  const [config, setConfig] = useState<Partial<ControlConfig>>({});
  const [message, setMessage] = useState("");
  const [active, setActive] = useState<keyof ControlConfig>("heroConfig");

  async function load() {
    const response = await fetch("/api/admin/config");
    if (response.ok) setConfig(await response.json() as Partial<ControlConfig>);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    const response = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setMessage(response.ok ? (isArabic ? "تم حفظ مركز التحكم." : "Control center saved.") : (isArabic ? "تعذر الحفظ." : "Could not save."));
    if (response.ok) refreshAdminLivePreview();
  }

  const tabs: Array<{ key: keyof ControlConfig; label: string }> = [
    { key: "heroConfig", label: isArabic ? "الهيرو" : "Hero" },
    { key: "themeConfig", label: isArabic ? "الثيم" : "Theme" },
    { key: "layoutConfig", label: isArabic ? "ترتيب الأقسام" : "Sections" },
    { key: "headerFooterConfig", label: isArabic ? "الهيدر والفوتر" : "Header/Footer" },
    { key: "bannerConfig", label: isArabic ? "العروض" : "Banner" },
    { key: "formConfig", label: isArabic ? "الفورم" : "Forms" },
    { key: "builderConfig", label: isArabic ? "Builder" : "Builder" },
    { key: "languageOverrides", label: isArabic ? "اللغات" : "Languages" },
    { key: "siteText", label: isArabic ? "نصوص الموقع" : "Site Text" },
    { key: "scriptsConfig", label: isArabic ? "سكريبتات" : "Scripts" },
  ];

  return (
    <section className="admin-editor-card admin-settings-card">
      <h3>{isArabic ? "مركز التحكم الكامل" : "Full Site Control Center"}</h3>
      <div className="admin-tabs">{tabs.map((tab) => <button className={active === tab.key ? "active" : ""} type="button" key={tab.key} onClick={() => setActive(tab.key)}>{tab.label}</button>)}</div>
      <ControlQuickEditor
        active={active}
        value={config[active] || {}}
        onChange={(value) => setConfig({ ...config, [active]: value })}
        isArabic={isArabic}
      />
      <JsonEditor
        value={config[active] || {}}
        onChange={(value) => setConfig({ ...config, [active]: value })}
        isArabic={isArabic}
      />
      {message ? <p className="admin-form-message">{message}</p> : null}
      <button className="primary-button" type="button" onClick={() => void save()}>{isArabic ? "حفظ كل التحكمات" : "Save Controls"}</button>
    </section>
  );
}

const sectionControlOptions = [
  ["hero", "الهيرو", "Hero"],
  ["stats", "العدادات", "Stats"],
  ["trust", "شريط الثقة", "Trust Bar"],
  ["implant", "فيديو/صورة الأسنان", "3D Dental Visual"],
  ["journey", "رحلة المريض", "Smile Journey"],
  ["quiz", "الاختبار السريع", "Quick Quiz"],
  ["preview", "Smile Preview", "Smile Preview"],
  ["comfort", "ليه تختار العيادة", "Why Choose Us"],
  ["services", "الخدمات", "Services"],
  ["reviews", "آراء المرضى", "Reviews"],
];

const navControlOptions = [
  ["home", "الرئيسية", "Home"],
  ["about", "عن الدكتور", "About"],
  ["services", "الخدمات", "Services"],
  ["cases", "قبل وبعد", "Before & After"],
  ["reviews", "آراء المرضى", "Reviews"],
  ["blog", "المقالات", "Blog"],
  ["contact", "تواصل معنا", "Contact"],
];

function ControlQuickEditor({ active, value, onChange, isArabic }: { active: keyof ControlConfig; value: unknown; onChange: (value: unknown) => void; isArabic: boolean }) {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const setField = (key: string, next: unknown) => onChange({ ...record, [key]: next });
  const textValue = (key: string) => String(record[key] || "");
  const boolValue = (key: string, fallback = false) => typeof record[key] === "boolean" ? Boolean(record[key]) : fallback;

  const renderTextField = (key: string, labelAr: string, labelEn: string, multiline = false) => (
    key.toLowerCase() === "icon" ? (
      <AdminIconPicker key={key} label={isArabic ? labelAr : labelEn} value={textValue(key)} onChange={(value) => setField(key, value)} isArabic={isArabic} />
    ) : isImageLikeField(key) ? (
      <AdminImageUrlField key={key} label={isArabic ? labelAr : labelEn} value={textValue(key)} onChange={(value) => setField(key, value)} isArabic={isArabic} />
    ) : (
      <label key={key}>
        <span>{isArabic ? labelAr : labelEn}</span>
        {multiline ? (
          <textarea value={textValue(key)} onChange={(event) => setField(key, event.target.value)} />
        ) : (
          <input value={textValue(key)} onChange={(event) => setField(key, event.target.value)} />
        )}
      </label>
    )
  );

  if (active === "heroConfig") {
    return (
      <div className="admin-quick-editor">
        <div className="admin-quick-head">
          <strong>{isArabic ? "تحكم الهيرو" : "Hero Controls"}</strong>
          <span>{isArabic ? "العناوين، الصور، الأزرار، وأرقام البداية." : "Headlines, media, buttons, and top metrics."}</span>
        </div>
        <div className="admin-quick-grid">
          {renderTextField("badgeAr", "البادج عربي", "Arabic badge")}
          {renderTextField("badgeEn", "البادج إنجليزي", "English badge")}
          {renderTextField("titleAr", "العنوان عربي", "Arabic title")}
          {renderTextField("titleEn", "العنوان إنجليزي", "English title")}
          {renderTextField("subtitleAr", "الوصف عربي", "Arabic subtitle", true)}
          {renderTextField("subtitleEn", "الوصف إنجليزي", "English subtitle", true)}
          {renderTextField("doctorImage", "صورة الدكتور", "Doctor image URL")}
          {renderTextField("teethImage", "صورة/فيديو الأسنان", "Dental visual URL")}
          {renderTextField("primaryCtaAr", "زر الحجز عربي", "Arabic primary CTA")}
          {renderTextField("primaryCtaEn", "زر الحجز إنجليزي", "English primary CTA")}
          {renderTextField("secondaryCtaAr", "زر الخدمات عربي", "Arabic secondary CTA")}
          {renderTextField("secondaryCtaEn", "زر الخدمات إنجليزي", "English secondary CTA")}
          {renderTextField("metric1", "العداد الأول", "Metric 1")}
          {renderTextField("metric2", "العداد الثاني", "Metric 2")}
          {renderTextField("metric3", "العداد الثالث", "Metric 3")}
        </div>
      </div>
    );
  }

  if (active === "siteText") {
    const siteFields = [
      ["servicesLabelAr", "عنوان صغير للخدمات عربي", "Arabic services label"],
      ["servicesLabelEn", "عنوان صغير للخدمات إنجليزي", "English services label"],
      ["servicesTitleAr", "عنوان الخدمات عربي", "Arabic services title"],
      ["servicesTitleEn", "عنوان الخدمات إنجليزي", "English services title"],
      ["servicesTextAr", "وصف الخدمات عربي", "Arabic services text"],
      ["servicesTextEn", "وصف الخدمات إنجليزي", "English services text"],
      ["reviewsTitleAr", "عنوان الآراء عربي", "Arabic reviews title"],
      ["reviewsTitleEn", "عنوان الآراء إنجليزي", "English reviews title"],
      ["reviewsTextAr", "وصف الآراء عربي", "Arabic reviews text"],
      ["reviewsTextEn", "وصف الآراء إنجليزي", "English reviews text"],
      ["reviewsButtonAr", "زر الآراء عربي", "Arabic reviews button"],
      ["reviewsButtonEn", "زر الآراء إنجليزي", "English reviews button"],
      ["trustTitleAr", "عنوان الثقة عربي", "Arabic trust title"],
      ["trustTitleEn", "عنوان الثقة إنجليزي", "English trust title"],
      ["trustTextAr", "وصف الثقة عربي", "Arabic trust text"],
      ["trustTextEn", "وصف الثقة إنجليزي", "English trust text"],
      ["pageAboutLabelAr", "ليبل صفحة عن الدكتور عربي", "Arabic about page label"],
      ["pageAboutTitleAr", "عنوان صفحة عن الدكتور عربي", "Arabic about page title"],
      ["pageAboutTextAr", "وصف صفحة عن الدكتور عربي", "Arabic about page text"],
      ["pageAboutLabelEn", "ليبل صفحة عن الدكتور إنجليزي", "English about page label"],
      ["pageAboutTitleEn", "عنوان صفحة عن الدكتور إنجليزي", "English about page title"],
      ["pageAboutTextEn", "وصف صفحة عن الدكتور إنجليزي", "English about page text"],
      ["pageServicesLabelAr", "ليبل صفحة الخدمات عربي", "Arabic services page label"],
      ["pageServicesTitleAr", "عنوان صفحة الخدمات عربي", "Arabic services page title"],
      ["pageServicesTextAr", "وصف صفحة الخدمات عربي", "Arabic services page text"],
      ["pageServicesLabelEn", "ليبل صفحة الخدمات إنجليزي", "English services page label"],
      ["pageServicesTitleEn", "عنوان صفحة الخدمات إنجليزي", "English services page title"],
      ["pageServicesTextEn", "وصف صفحة الخدمات إنجليزي", "English services page text"],
      ["pageCasesLabelAr", "ليبل صفحة قبل وبعد عربي", "Arabic cases page label"],
      ["pageCasesTitleAr", "عنوان صفحة قبل وبعد عربي", "Arabic cases page title"],
      ["pageCasesTextAr", "وصف صفحة قبل وبعد عربي", "Arabic cases page text"],
      ["pageCasesLabelEn", "ليبل صفحة قبل وبعد إنجليزي", "English cases page label"],
      ["pageCasesTitleEn", "عنوان صفحة قبل وبعد إنجليزي", "English cases page title"],
      ["pageCasesTextEn", "وصف صفحة قبل وبعد إنجليزي", "English cases page text"],
      ["pageReviewsLabelAr", "ليبل صفحة الآراء عربي", "Arabic reviews page label"],
      ["pageReviewsTitleAr", "عنوان صفحة الآراء عربي", "Arabic reviews page title"],
      ["pageReviewsTextAr", "وصف صفحة الآراء عربي", "Arabic reviews page text"],
      ["pageReviewsLabelEn", "ليبل صفحة الآراء إنجليزي", "English reviews page label"],
      ["pageReviewsTitleEn", "عنوان صفحة الآراء إنجليزي", "English reviews page title"],
      ["pageReviewsTextEn", "وصف صفحة الآراء إنجليزي", "English reviews page text"],
      ["pageBlogLabelAr", "ليبل صفحة المدونة عربي", "Arabic blog page label"],
      ["pageBlogTitleAr", "عنوان صفحة المدونة عربي", "Arabic blog page title"],
      ["pageBlogTextAr", "وصف صفحة المدونة عربي", "Arabic blog page text"],
      ["pageBlogLabelEn", "ليبل صفحة المدونة إنجليزي", "English blog page label"],
      ["pageBlogTitleEn", "عنوان صفحة المدونة إنجليزي", "English blog page title"],
      ["pageBlogTextEn", "وصف صفحة المدونة إنجليزي", "English blog page text"],
      ["pageContactLabelAr", "ليبل صفحة التواصل عربي", "Arabic contact page label"],
      ["pageContactTitleAr", "عنوان صفحة التواصل عربي", "Arabic contact page title"],
      ["pageContactTextAr", "وصف صفحة التواصل عربي", "Arabic contact page text"],
      ["pageContactLabelEn", "ليبل صفحة التواصل إنجليزي", "English contact page label"],
      ["pageContactTitleEn", "عنوان صفحة التواصل إنجليزي", "English contact page title"],
      ["pageContactTextEn", "وصف صفحة التواصل إنجليزي", "English contact page text"],
    ];
    return (
      <div className="admin-quick-editor">
        <div className="admin-quick-head">
          <strong>{isArabic ? "نصوص الموقع" : "Website Texts"}</strong>
          <span>{isArabic ? "تحكم سريع في أهم نصوص الصفحة الرئيسية بالعربي والإنجليزي." : "Quick control for the most important homepage copy in both languages."}</span>
        </div>
        <div className="admin-quick-grid">
          {siteFields.map(([key, ar, en]) => renderTextField(key, ar, en, key.includes("Text")))}
        </div>
      </div>
    );
  }

  if (active === "themeConfig") {
    return (
      <div className="admin-quick-editor">
        <div className="admin-quick-head">
          <strong>{isArabic ? "الثيم والألوان" : "Theme & Colors"}</strong>
          <span>{isArabic ? "غيّر درجات الذهبي والفحمي بدون تعديل CSS." : "Tune gold and charcoal tones without editing CSS."}</span>
        </div>
        <div className="admin-quick-grid compact">
          {["gold", "bronze", "charcoal", "background"].map((key) => (
            <label key={key}>
              <span>{key}</span>
              <input type="color" value={textValue(key) || (key === "charcoal" ? "#111827" : key === "background" ? "#ffffff" : "#d4af37")} onChange={(event) => setField(key, event.target.value)} />
            </label>
          ))}
          <label>
            <span>{isArabic ? "شكل الأزرار" : "Button style"}</span>
            <select value={textValue("buttonStyle") || "gradient"} onChange={(event) => setField("buttonStyle", event.target.value)}>
              <option value="gradient">{isArabic ? "ذهبي متدرج" : "Gold gradient"}</option>
              <option value="solid">{isArabic ? "لون ثابت" : "Solid"}</option>
              <option value="soft">{isArabic ? "ناعم" : "Soft"}</option>
            </select>
          </label>
          <label>
            <span>{isArabic ? "استدارة الكروت" : "Card radius"}</span>
            <input type="range" min="8" max="34" value={textValue("cardRadius") || "18"} onChange={(event) => setField("cardRadius", event.target.value)} />
          </label>
          <label>
            <span>{isArabic ? "قوة الظل" : "Shadow strength"}</span>
            <select value={textValue("shadowLevel") || "medium"} onChange={(event) => setField("shadowLevel", event.target.value)}>
              <option value="soft">{isArabic ? "خفيف" : "Soft"}</option>
              <option value="medium">{isArabic ? "متوسط" : "Medium"}</option>
              <option value="strong">{isArabic ? "قوي" : "Strong"}</option>
            </select>
          </label>
          <label>
            <span>{isArabic ? "حجم العناوين" : "Heading size"}</span>
            <input type="range" min="0.9" max="1.12" step="0.01" value={textValue("headingScale") || "1"} onChange={(event) => setField("headingScale", event.target.value)} />
          </label>
          <label>
            <span>{isArabic ? "حجم النصوص" : "Body text size"}</span>
            <input type="range" min="0.94" max="1.1" step="0.01" value={textValue("bodyScale") || "1"} onChange={(event) => setField("bodyScale", event.target.value)} />
          </label>
          <label className="admin-check quick-check">
            <input type="checkbox" checked={boolValue("darkModeEnabled", true)} onChange={(event) => setField("darkModeEnabled", event.target.checked)} />
            <span>{isArabic ? "تفعيل الدارك مود" : "Enable dark mode"}</span>
          </label>
        </div>
      </div>
    );
  }

  if (active === "layoutConfig") {
    const sections = Array.isArray(record.sections) ? record.sections.map(String) : sectionControlOptions.map((item) => item[0]);
    const hiddenSections = new Set(Array.isArray(record.hiddenSections) ? record.hiddenSections.map(String) : []);
    const moveSection = (key: string, direction: -1 | 1) => {
      const next = [...sections];
      const index = next.indexOf(key);
      const swap = index + direction;
      if (index < 0 || swap < 0 || swap >= next.length) return;
      [next[index], next[swap]] = [next[swap], next[index]];
      onChange({ ...record, sections: next, hiddenSections: Array.from(hiddenSections) });
    };
    const toggleSection = (key: string) => {
      const nextHidden = new Set(hiddenSections);
      nextHidden.has(key) ? nextHidden.delete(key) : nextHidden.add(key);
      onChange({ ...record, sections, hiddenSections: Array.from(nextHidden) });
    };
    return (
      <div className="admin-quick-editor">
        <div className="admin-quick-head">
          <strong>{isArabic ? "ترتيب أقسام الهوم" : "Homepage Section Order"}</strong>
          <span>{isArabic ? "إظهار، إخفاء، وترتيب الأقسام بدون كود." : "Show, hide, and reorder homepage sections without code."}</span>
        </div>
        <div className="admin-section-order">
          {sections.map((key) => {
            const option = sectionControlOptions.find((item) => item[0] === key);
            return (
              <div className="admin-section-row" key={key}>
                <label className="admin-check">
                  <input type="checkbox" checked={!hiddenSections.has(key)} onChange={() => toggleSection(key)} />
                  <span>{option ? (isArabic ? option[1] : option[2]) : key}</span>
                </label>
                <div className="admin-mini-actions">
                  <button type="button" onClick={() => moveSection(key, -1)}>↑</button>
                  <button type="button" onClick={() => moveSection(key, 1)}>↓</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (active === "headerFooterConfig") {
    const navOrder = Array.isArray(record.navOrder) ? record.navOrder.map(String) : navControlOptions.map((item) => item[0]);
    const moveNav = (key: string, direction: -1 | 1) => {
      const next = [...navOrder];
      const index = next.indexOf(key);
      const swap = index + direction;
      if (index < 0 || swap < 0 || swap >= next.length) return;
      [next[index], next[swap]] = [next[swap], next[index]];
      onChange({ ...record, navOrder: next });
    };
    return (
      <div className="admin-quick-editor">
        <div className="admin-quick-head">
          <strong>{isArabic ? "الهيدر والفوتر" : "Header & Footer"}</strong>
          <span>{isArabic ? "اللوجو، نص الفوتر، السوشيال، وترتيب روابط النافبار." : "Logo, footer copy, social visibility, and navbar order."}</span>
        </div>
        <div className="admin-quick-grid">
          {renderTextField("logo", "رابط اللوجو", "Logo URL")}
          {renderTextField("footerTextAr", "نص الفوتر عربي", "Arabic footer text", true)}
          {renderTextField("footerTextEn", "نص الفوتر إنجليزي", "English footer text", true)}
          <label className="admin-check quick-check">
            <input type="checkbox" checked={boolValue("showSocial", true)} onChange={(event) => setField("showSocial", event.target.checked)} />
            <span>{isArabic ? "إظهار السوشيال ميديا" : "Show social media"}</span>
          </label>
        </div>
        <div className="admin-section-order">
          {navOrder.map((key) => {
            const option = navControlOptions.find((item) => item[0] === key);
            return (
              <div className="admin-section-row" key={key}>
                <strong>{option ? (isArabic ? option[1] : option[2]) : key}</strong>
                <div className="admin-mini-actions">
                  <button type="button" onClick={() => moveNav(key, -1)}>↑</button>
                  <button type="button" onClick={() => moveNav(key, 1)}>↓</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (active === "bannerConfig") {
    return (
      <div className="admin-quick-editor">
        <div className="admin-quick-head">
          <strong>{isArabic ? "العروض والتنبيهات" : "Offers & Alerts"}</strong>
          <span>{isArabic ? "شريط علوي مؤقت للرسائل المهمة." : "A temporary top alert bar for important messages."}</span>
        </div>
        <div className="admin-quick-grid">
          <label className="admin-check quick-check">
            <input type="checkbox" checked={boolValue("enabled")} onChange={(event) => setField("enabled", event.target.checked)} />
            <span>{isArabic ? "تفعيل الشريط" : "Enable banner"}</span>
          </label>
          {renderTextField("textAr", "النص عربي", "Arabic text")}
          {renderTextField("textEn", "النص إنجليزي", "English text")}
          {renderTextField("link", "الرابط", "Link")}
        </div>
      </div>
    );
  }

  if (active === "formConfig") {
    const fields = [
      ["requireName", "الاسم إجباري", "Name required"],
      ["requirePhone", "الهاتف إجباري", "Phone required"],
      ["showAge", "إظهار السن", "Show age"],
      ["showImage", "إظهار رفع صورة", "Show image upload"],
      ["showDate", "إظهار التاريخ", "Show date"],
      ["showMessage", "إظهار الرسالة", "Show message"],
    ];
    return (
      <div className="admin-quick-editor">
        <div className="admin-quick-head">
          <strong>{isArabic ? "حقول نماذج التواصل" : "Contact Form Fields"}</strong>
          <span>{isArabic ? "اختار الحقول المطلوبة قبل فتح واتساب أو تسجيل الحجز." : "Choose fields required before opening WhatsApp or saving a booking."}</span>
        </div>
        <div className="admin-toggle-grid">
          {fields.map(([key, ar, en]) => (
            <label className="admin-check quick-check" key={key}>
              <input type="checkbox" checked={boolValue(key)} onChange={(event) => setField(key, event.target.checked)} />
              <span>{isArabic ? ar : en}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (active === "scriptsConfig") {
    return (
      <div className="admin-quick-editor">
        <div className="admin-quick-head">
          <strong>{isArabic ? "سكريبتات خارجية" : "External Scripts"}</strong>
          <span>{isArabic ? "خانات آمنة لحفظ Google Analytics و Meta Pixel و TikTok Pixel و GTM." : "Safe fields for Google Analytics, Meta Pixel, TikTok Pixel, and GTM IDs."}</span>
        </div>
        <div className="admin-quick-grid">
          {renderTextField("googleAnalytics", "Google Analytics", "Google Analytics")}
          {renderTextField("googleTagManager", "Google Tag Manager", "Google Tag Manager")}
          {renderTextField("metaPixel", "Meta Pixel", "Meta Pixel")}
          {renderTextField("tiktokPixel", "TikTok Pixel", "TikTok Pixel")}
        </div>
      </div>
    );
  }

  if (active === "builderConfig") {
    return <BuilderConfigEditor value={record as BuilderConfig} onChange={(next) => onChange(next)} isArabic={isArabic} />;
  }

  return (
    <div className="admin-quick-editor">
      <div className="admin-quick-head">
        <strong>{isArabic ? "تحكم متقدم" : "Advanced Controls"}</strong>
        <span>{isArabic ? "هذا الجزء متاح حالياً من محرر JSON المتقدم بالأسفل." : "This section is currently editable through the advanced JSON editor below."}</span>
      </div>
    </div>
  );
}

const builderCollections = [
  { key: "trustItems", labelAr: "شريط الثقة", labelEn: "Trust Bar", type: "card" },
  { key: "comfortItems", labelAr: "ليه تختار العيادة", labelEn: "Why Choose Us", type: "card-rich" },
  { key: "journeySteps", labelAr: "رحلة المريض", labelEn: "Patient Journey", type: "journey" },
  { key: "quizOptions", labelAr: "الاختبار السريع", labelEn: "Quick Quiz", type: "quiz" },
  { key: "patientQuestions", labelAr: "أسئلة المدونة", labelEn: "Blog Questions", type: "question" },
  { key: "clinicTour", labelAr: "صور جولة العيادة", labelEn: "Clinic Tour Images", type: "tour" },
] as const;

const defaultBuilderItems: Record<string, Record<string, unknown>> = {
  trustItems: { icon: "sparkles", ar: "ميزة جديدة", en: "New highlight", enabled: true },
  comfortItems: { ar: "ميزة جديدة", en: "New feature", textAr: "اكتب الوصف هنا.", textEn: "Write the description here.", image: "/icons/comfort-face.png", enabled: true },
  journeySteps: { key: "new-step", icon: "plan", titleAr: "خطوة جديدة", titleEn: "New Step", textAr: "اكتب تفاصيل الخطوة هنا.", textEn: "Write step details here.", enabled: true },
  quizOptions: { key: "new-option", labelAr: "اختيار جديد", labelEn: "New Option", messageAr: "رسالة واتساب لهذا الاختيار", messageEn: "WhatsApp message for this option", enabled: true },
  patientQuestions: { questionAr: "سؤال جديد؟", questionEn: "New question?", answerAr: "اكتب الإجابة هنا.", answerEn: "Write the answer here.", enabled: true },
  clinicTour: { image: "/inner/clinic-reception.png", altAr: "صورة من العيادة", altEn: "Clinic image", enabled: true },
};

function BuilderConfigEditor({ value, onChange, isArabic }: { value: BuilderConfig; onChange: (value: BuilderConfig) => void; isArabic: boolean }) {
  const [activeCollection, setActiveCollection] = useState<typeof builderCollections[number]["key"]>("trustItems");
  const current = builderCollections.find((item) => item.key === activeCollection) || builderCollections[0];
  const items = Array.isArray(value[activeCollection]) ? [...value[activeCollection] as Record<string, unknown>[]] : [];
  const blogThumbs = Array.isArray(value.blogThumbs) ? value.blogThumbs : [];

  const updateItem = (index: number, key: string, nextValue: unknown) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], [key]: nextValue };
    onChange({ ...value, [activeCollection]: nextItems });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const swap = index + direction;
    if (swap < 0 || swap >= items.length) return;
    const nextItems = [...items];
    [nextItems[index], nextItems[swap]] = [nextItems[swap], nextItems[index]];
    onChange({ ...value, [activeCollection]: nextItems });
  };

  const addItem = () => onChange({ ...value, [activeCollection]: [...items, defaultBuilderItems[activeCollection]] });
  const removeItem = (index: number) => onChange({ ...value, [activeCollection]: items.filter((_, itemIndex) => itemIndex !== index) });

  return (
    <div className="admin-quick-editor builder-editor">
      <div className="admin-quick-head">
        <div>
          <strong>{isArabic ? "Full CMS Builder" : "Full CMS Builder"}</strong>
          <span>{isArabic ? "تحكم في كروت ونصوص وصور السكشنات الثابتة في الموقع." : "Control cards, copy, and images for fixed website sections."}</span>
        </div>
        <button className="secondary-button" type="button" onClick={addItem}>{isArabic ? "إضافة عنصر" : "Add Item"}</button>
      </div>

      <div className="builder-tabs">
        {builderCollections.map((collection) => (
          <button className={activeCollection === collection.key ? "active" : ""} type="button" key={collection.key} onClick={() => setActiveCollection(collection.key)}>
            {isArabic ? collection.labelAr : collection.labelEn}
          </button>
        ))}
      </div>

      <div className="builder-items">
        {items.map((item, index) => (
          <BuilderItemEditor
            item={item}
            index={index}
            type={current.type}
            isArabic={isArabic}
            onChange={updateItem}
            onMove={moveItem}
            onRemove={removeItem}
            key={`${activeCollection}-${index}`}
          />
        ))}
        {!items.length ? <p className="builder-empty">{isArabic ? "لا توجد عناصر حالياً. اضغط إضافة عنصر." : "No items yet. Add one to start."}</p> : null}
      </div>

      <BuilderSingletonEditors value={value} onChange={onChange} isArabic={isArabic} />
      <BuilderImageListEditor images={blogThumbs} onChange={(blogThumbs) => onChange({ ...value, blogThumbs })} isArabic={isArabic} />
    </div>
  );
}

function BuilderItemEditor({
  item,
  index,
  type,
  isArabic,
  onChange,
  onMove,
  onRemove,
}: {
  item: Record<string, unknown>;
  index: number;
  type: string;
  isArabic: boolean;
  onChange: (index: number, key: string, value: unknown) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}) {
  const text = (key: string) => String(item[key] || "");
  const enabled = item.enabled !== false;
  const field = (key: string, labelAr: string, labelEn: string, multiline = false) => (
    key.toLowerCase() === "icon" ? (
      <AdminIconPicker label={isArabic ? labelAr : labelEn} value={text(key)} onChange={(value) => onChange(index, key, value)} isArabic={isArabic} />
    ) : isImageLikeField(key) ? (
      <AdminImageUrlField label={isArabic ? labelAr : labelEn} value={text(key)} onChange={(value) => onChange(index, key, value)} isArabic={isArabic} />
    ) : (
      <label>
        <span>{isArabic ? labelAr : labelEn}</span>
        {multiline ? (
          <textarea value={text(key)} onChange={(event) => onChange(index, key, event.target.value)} />
        ) : (
          <input value={text(key)} onChange={(event) => onChange(index, key, event.target.value)} />
        )}
      </label>
    )
  );

  return (
    <article className={enabled ? "builder-item-card" : "builder-item-card disabled"}>
      <div className="builder-item-head">
        <strong>{isArabic ? `عنصر ${index + 1}` : `Item ${index + 1}`}</strong>
        <div className="admin-mini-actions">
          <button type="button" onClick={() => onMove(index, -1)}>↑</button>
          <button type="button" onClick={() => onMove(index, 1)}>↓</button>
          <button type="button" onClick={() => onRemove(index)}>×</button>
        </div>
      </div>
      <label className="admin-check quick-check">
        <input type="checkbox" checked={enabled} onChange={(event) => onChange(index, "enabled", event.target.checked)} />
        <span>{isArabic ? "ظاهر في الموقع" : "Visible on website"}</span>
      </label>
      <div className="admin-quick-grid">
        {type === "journey" ? (
          <>
            {field("key", "كود الخطوة", "Step key")}
            {field("icon", "الأيقونة", "Icon")}
            {field("titleAr", "العنوان عربي", "Arabic title")}
            {field("titleEn", "العنوان إنجليزي", "English title")}
            {field("textAr", "الوصف عربي", "Arabic text", true)}
            {field("textEn", "الوصف إنجليزي", "English text", true)}
          </>
        ) : type === "quiz" ? (
          <>
            {field("key", "كود الاختيار", "Option key")}
            {field("labelAr", "النص عربي", "Arabic label")}
            {field("labelEn", "النص إنجليزي", "English label")}
            {field("messageAr", "رسالة واتساب عربي", "Arabic WhatsApp message", true)}
            {field("messageEn", "رسالة واتساب إنجليزي", "English WhatsApp message", true)}
          </>
        ) : type === "question" ? (
          <>
            {field("questionAr", "السؤال عربي", "Arabic question")}
            {field("questionEn", "السؤال إنجليزي", "English question")}
            {field("answerAr", "الإجابة عربي", "Arabic answer", true)}
            {field("answerEn", "الإجابة إنجليزي", "English answer", true)}
          </>
        ) : type === "tour" ? (
          <>
            {field("image", "رابط الصورة", "Image URL")}
            {field("altAr", "وصف الصورة عربي", "Arabic image alt")}
            {field("altEn", "وصف الصورة إنجليزي", "English image alt")}
          </>
        ) : (
          <>
            {field("icon", "الأيقونة", "Icon")}
            {field("ar", "العنوان عربي", "Arabic title")}
            {field("en", "العنوان إنجليزي", "English title")}
            {type === "card-rich" ? field("textAr", "الوصف عربي", "Arabic text", true) : null}
            {type === "card-rich" ? field("textEn", "الوصف إنجليزي", "English text", true) : null}
            {type === "card-rich" ? field("image", "رابط الصورة", "Image URL") : null}
          </>
        )}
      </div>
    </article>
  );
}

function BuilderSingletonEditors({ value, onChange, isArabic }: { value: BuilderConfig; onChange: (value: BuilderConfig) => void; isArabic: boolean }) {
  const updateRecord = (key: keyof BuilderConfig, field: string, nextValue: string) => {
    const current = value[key] && typeof value[key] === "object" && !Array.isArray(value[key]) ? value[key] as Record<string, unknown> : {};
    onChange({ ...value, [key]: { ...current, [field]: nextValue } });
  };
  const text = (key: keyof BuilderConfig, field: string) => {
    const current = value[key] && typeof value[key] === "object" && !Array.isArray(value[key]) ? value[key] as Record<string, unknown> : {};
    return String(current[field] || "");
  };
  const simpleField = (section: keyof BuilderConfig, field: string, labelAr: string, labelEn: string, multiline = false) => (
    isImageLikeField(field) ? (
      <AdminImageUrlField label={isArabic ? labelAr : labelEn} value={text(section, field)} onChange={(value) => updateRecord(section, field, value)} isArabic={isArabic} />
    ) : (
      <label>
        <span>{isArabic ? labelAr : labelEn}</span>
        {multiline ? (
          <textarea value={text(section, field)} onChange={(event) => updateRecord(section, field, event.target.value)} />
        ) : (
          <input value={text(section, field)} onChange={(event) => updateRecord(section, field, event.target.value)} />
        )}
      </label>
    )
  );

  return (
    <div className="builder-singletons">
      <details>
        <summary>{isArabic ? "سكشن الزراعة ثلاثي الأبعاد" : "3D Implant Section"}</summary>
        <div className="admin-quick-grid">
          {simpleField("implantSection", "labelAr", "الليبل عربي", "Arabic label")}
          {simpleField("implantSection", "labelEn", "الليبل إنجليزي", "English label")}
          {simpleField("implantSection", "titleAr", "العنوان عربي", "Arabic title")}
          {simpleField("implantSection", "titleEn", "العنوان إنجليزي", "English title")}
          {simpleField("implantSection", "textAr", "الوصف عربي", "Arabic text", true)}
          {simpleField("implantSection", "textEn", "الوصف إنجليزي", "English text", true)}
          {simpleField("implantSection", "image", "الصورة", "Image")}
          {simpleField("implantSection", "buttonAr", "زر الحجز عربي", "Arabic button")}
          {simpleField("implantSection", "buttonEn", "زر الحجز إنجليزي", "English button")}
          {simpleField("implantSection", "linkTextAr", "زر التفاصيل عربي", "Arabic details link")}
          {simpleField("implantSection", "linkTextEn", "زر التفاصيل إنجليزي", "English details link")}
        </div>
      </details>
      <details>
        <summary>{isArabic ? "سكشن Smile Preview" : "Smile Preview Section"}</summary>
        <div className="admin-quick-grid">
          {simpleField("previewSection", "labelAr", "الليبل عربي", "Arabic label")}
          {simpleField("previewSection", "labelEn", "الليبل إنجليزي", "English label")}
          {simpleField("previewSection", "titleAr", "العنوان عربي", "Arabic title")}
          {simpleField("previewSection", "titleEn", "العنوان إنجليزي", "English title")}
          {simpleField("previewSection", "textAr", "الوصف عربي", "Arabic text", true)}
          {simpleField("previewSection", "textEn", "الوصف إنجليزي", "English text", true)}
          {simpleField("previewSection", "buttonAr", "زر واتساب عربي", "Arabic button")}
          {simpleField("previewSection", "buttonEn", "زر واتساب إنجليزي", "English button")}
          {simpleField("previewSection", "namePlaceholderAr", "Placeholder الاسم عربي", "Arabic name placeholder")}
          {simpleField("previewSection", "namePlaceholderEn", "Placeholder الاسم إنجليزي", "English name placeholder")}
          {simpleField("previewSection", "problemPlaceholderAr", "Placeholder المشكلة عربي", "Arabic concern placeholder")}
          {simpleField("previewSection", "problemPlaceholderEn", "Placeholder المشكلة إنجليزي", "English concern placeholder")}
        </div>
      </details>
      <details>
        <summary>{isArabic ? "صفحة قبل وبعد" : "Before & After Page"}</summary>
        <div className="admin-quick-grid">
          {simpleField("casesPage", "labelAr", "الليبل عربي", "Arabic label")}
          {simpleField("casesPage", "labelEn", "الليبل إنجليزي", "English label")}
          {simpleField("casesPage", "titleAr", "العنوان عربي", "Arabic title")}
          {simpleField("casesPage", "titleEn", "العنوان إنجليزي", "English title")}
          {simpleField("casesPage", "textAr", "الوصف عربي", "Arabic text", true)}
          {simpleField("casesPage", "textEn", "الوصف إنجليزي", "English text", true)}
          {simpleField("casesPage", "proof1Ar", "دليل الثقة 1 عربي", "Arabic proof 1")}
          {simpleField("casesPage", "proof1En", "دليل الثقة 1 إنجليزي", "English proof 1")}
          {simpleField("casesPage", "proof2Ar", "دليل الثقة 2 عربي", "Arabic proof 2")}
          {simpleField("casesPage", "proof2En", "دليل الثقة 2 إنجليزي", "English proof 2")}
          {simpleField("casesPage", "proof3Ar", "دليل الثقة 3 عربي", "Arabic proof 3")}
          {simpleField("casesPage", "proof3En", "دليل الثقة 3 إنجليزي", "English proof 3")}
        </div>
      </details>
      <details>
        <summary>{isArabic ? "تسميات المقال" : "Article Labels"}</summary>
        <div className="admin-quick-grid">
          {simpleField("articleLabels", "detailLabelAr", "ليبل المقال عربي", "Arabic article label")}
          {simpleField("articleLabels", "detailLabelEn", "ليبل المقال إنجليزي", "English article label")}
          {simpleField("articleLabels", "footerLabelAr", "ليبل فوتر المقال عربي", "Arabic footer label")}
          {simpleField("articleLabels", "footerLabelEn", "ليبل فوتر المقال إنجليزي", "English footer label")}
          {simpleField("articleLabels", "shareAr", "زر المشاركة عربي", "Arabic share button")}
          {simpleField("articleLabels", "shareEn", "زر المشاركة إنجليزي", "English share button")}
        </div>
      </details>
    </div>
  );
}

function BuilderImageListEditor({
  images,
  onChange,
  isArabic,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  isArabic: boolean;
}) {
  const updateImage = (index: number, value: string) => {
    const next = [...images];
    next[index] = value;
    onChange(next);
  };
  const moveImage = (index: number, direction: -1 | 1) => {
    const swap = index + direction;
    if (swap < 0 || swap >= images.length) return;
    const next = [...images];
    [next[index], next[swap]] = [next[swap], next[index]];
    onChange(next);
  };

  return (
    <details className="builder-image-list" open>
      <summary>{isArabic ? "صور كروت المقالات في الرئيسية" : "Homepage Blog Card Images"}</summary>
      <div className="builder-items">
        {images.map((image, index) => (
          <article className="builder-item-card" key={`${image}-${index}`}>
            <div className="builder-item-head">
              <strong>{isArabic ? `صورة ${index + 1}` : `Image ${index + 1}`}</strong>
              <div className="admin-mini-actions">
                <button type="button" onClick={() => moveImage(index, -1)}>↑</button>
                <button type="button" onClick={() => moveImage(index, 1)}>↓</button>
                <button type="button" onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}>×</button>
              </div>
            </div>
            <AdminImageUrlField label={isArabic ? "رابط أو رفع الصورة" : "Image URL or upload"} value={image} onChange={(value) => updateImage(index, value)} isArabic={isArabic} />
          </article>
        ))}
        <button className="secondary-button" type="button" onClick={() => onChange([...images, "/inner/blog-hygiene.png"])}>
          {isArabic ? "إضافة صورة مقال" : "Add Blog Image"}
        </button>
      </div>
    </details>
  );
}

function JsonEditor({ value, onChange, isArabic }: { value: unknown; onChange: (value: unknown) => void; isArabic: boolean }) {
  const [text, setText] = useState(JSON.stringify(value || {}, null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    setText(JSON.stringify(value || {}, null, 2));
  }, [value]);

  function update(next: string) {
    setText(next);
    try {
      onChange(JSON.parse(next || "{}"));
      setError("");
    } catch {
      setError(isArabic ? "صيغة JSON غير صحيحة." : "Invalid JSON format.");
    }
  }

  return (
    <label className="admin-json-field">
      <span>{isArabic ? "عدّل البيانات بصيغة JSON" : "Edit JSON settings"}</span>
      <textarea value={text} onChange={(event) => update(event.target.value)} spellCheck={false} />
      {error ? <small className="admin-error">{error}</small> : null}
    </label>
  );
}

function HomeContentManager({ isArabic }: { isArabic: boolean }) {
  const [config, setConfig] = useState<HomeConfig>({ serviceIds: [], articleIds: [], caseIds: [], reviewIds: [] });
  const [servicesData, setServicesData] = useState<ServiceItem[]>([]);
  const [articlesData, setArticlesData] = useState<AdminArticle[]>([]);
  const [casesData, setCasesData] = useState<AdminGalleryItem[]>([]);
  const [reviewsData, setReviewsData] = useState<AdminReview[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const [configResponse, servicesResponse, articlesResponse, casesResponse, reviewsResponse] = await Promise.all([
      fetch("/api/admin/config"),
      fetch("/api/admin/services?pageSize=25&status=published"),
      fetch("/api/admin/articles?pageSize=25&status=published"),
      fetch("/api/admin/gallery?pageSize=25&status=published"),
      fetch("/api/admin/reviews?pageSize=40&status=all"),
    ]);
    if (configResponse.ok) {
      const homeConfig = ((await configResponse.json()) as { homeConfig: HomeConfig }).homeConfig || { serviceIds: [], articleIds: [], caseIds: [], reviewIds: [] };
      setConfig({ serviceIds: [], articleIds: [], caseIds: [], reviewIds: [], ...homeConfig });
    }
    if (servicesResponse.ok) setServicesData(((await servicesResponse.json()) as { items: ServiceItem[] }).items);
    if (articlesResponse.ok) setArticlesData(((await articlesResponse.json()) as { items: AdminArticle[] }).items);
    if (casesResponse.ok) setCasesData(((await casesResponse.json()) as { items: AdminGalleryItem[] }).items);
    if (reviewsResponse.ok) setReviewsData(((await reviewsResponse.json()) as { items: AdminReview[] }).items.filter((item) => item.status === "approved" || item.status === "published"));
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    const response = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeConfig: config }),
    });
    setMessage(response.ok ? (isArabic ? "تم حفظ ترتيب الصفحة الرئيسية." : "Homepage order saved.") : (isArabic ? "تعذر حفظ الإعدادات." : "Could not save homepage settings."));
    if (response.ok) refreshAdminLivePreview();
  }

  return (
    <section className="admin-editor-card admin-settings-card">
      <h3>{isArabic ? "اختيار وترتيب عناصر الصفحة الرئيسية" : "Choose and Order Homepage Items"}</h3>
      <div className="admin-config-grid">
        <OrderPicker
          title={isArabic ? "الخدمات في الهوم" : "Homepage Services"}
          selectedIds={config.serviceIds}
          options={servicesData.map((item) => ({ id: item.id, label: isArabic ? item.title_ar : item.title_en }))}
          onChange={(serviceIds) => setConfig({ ...config, serviceIds })}
          isArabic={isArabic}
        />
        <OrderPicker
          title={isArabic ? "المقالات المميزة" : "Featured Articles"}
          selectedIds={config.articleIds}
          options={articlesData.map((item) => ({ id: item.id, label: item.title }))}
          onChange={(articleIds) => setConfig({ ...config, articleIds })}
          isArabic={isArabic}
        />
        <OrderPicker
          title={isArabic ? "حالات قبل وبعد" : "Featured Cases"}
          selectedIds={config.caseIds}
          options={casesData.map((item) => ({ id: item.id, label: item.title }))}
          onChange={(caseIds) => setConfig({ ...config, caseIds })}
          isArabic={isArabic}
        />
        <OrderPicker
          title={isArabic ? "آراء الهوم" : "Homepage Reviews"}
          selectedIds={config.reviewIds || []}
          options={reviewsData.map((item) => ({ id: item.id, label: `${item.name} - ${item.message.slice(0, 42)}...` }))}
          onChange={(reviewIds) => setConfig({ ...config, reviewIds })}
          isArabic={isArabic}
        />
      </div>
      {message ? <p className="admin-form-message">{message}</p> : null}
      <button className="primary-button" type="button" onClick={() => void save()}>{isArabic ? "حفظ الهوم" : "Save Homepage"}</button>
    </section>
  );
}

function OrderPicker({ title, selectedIds, options, onChange, isArabic }: { title: string; selectedIds: number[]; options: Array<{ id: number; label: string }>; onChange: (ids: number[]) => void; isArabic: boolean }) {
  const selected = selectedIds.map((id) => options.find((item) => item.id === id)).filter(Boolean) as Array<{ id: number; label: string }>;
  const available = options.filter((item) => !selectedIds.includes(item.id));

  function move(id: number, direction: -1 | 1) {
    const index = selectedIds.indexOf(id);
    const next = [...selectedIds];
    const swapIndex = index + direction;
    if (index < 0 || swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    onChange(next);
  }

  return (
    <div className="admin-order-picker">
      <h4>{title}</h4>
      <select value="" onChange={(event) => event.target.value ? onChange([...selectedIds, Number(event.target.value)]) : null}>
        <option value="">{isArabic ? "أضف عنصر" : "Add item"}</option>
        {available.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
      </select>
      <div className="admin-order-list">
        {selected.map((item) => (
          <div key={item.id}>
            <span>{item.label}</span>
            <button type="button" onClick={() => move(item.id, -1)}>↑</button>
            <button type="button" onClick={() => move(item.id, 1)}>↓</button>
            <button type="button" onClick={() => onChange(selectedIds.filter((id) => id !== item.id))}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorProfileManager({ isArabic }: { isArabic: boolean }) {
  const [profile, setProfile] = useState<DoctorProfile>({});
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/config");
    if (response.ok) setProfile(((await response.json()) as { doctorProfile: DoctorProfile }).doctorProfile);
  }

  useEffect(() => {
    void load();
  }, []);

  async function uploadImage(file: File | undefined) {
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (url) setProfile({ ...profile, imageUrl: url });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorProfile: profile }),
    });
    setMessage(response.ok ? (isArabic ? "تم حفظ بيانات الدكتور." : "Doctor profile saved.") : (isArabic ? "تعذر الحفظ." : "Could not save."));
    if (response.ok) refreshAdminLivePreview();
  }

  const fields: Array<{ key: keyof DoctorProfile; ar: string; en: string }> = [
    { key: "nameAr", ar: "اسم الدكتور عربي", en: "Arabic name" },
    { key: "nameEn", ar: "اسم الدكتور إنجليزي", en: "English name" },
    { key: "titleAr", ar: "اللقب عربي", en: "Arabic title" },
    { key: "titleEn", ar: "اللقب إنجليزي", en: "English title" },
    { key: "yearsExperience", ar: "سنوات الخبرة", en: "Years of experience" },
    { key: "certifications", ar: "الشهادات", en: "Certifications" },
    { key: "bioAr", ar: "نبذة عربي", en: "Arabic bio" },
    { key: "bioEn", ar: "نبذة إنجليزي", en: "English bio" },
  ];

  return (
    <section className="admin-editor-card admin-settings-card">
      <h3>{isArabic ? "بيانات الدكتور" : "Doctor Profile"}</h3>
      <form className="admin-form admin-settings-grid" onSubmit={save}>
        {fields.map((field) => (
          <label key={field.key}>
            <span>{isArabic ? field.ar : field.en}</span>
            {field.key === "bioAr" || field.key === "bioEn" ? (
              <textarea value={profile[field.key] || ""} onChange={(event) => setProfile({ ...profile, [field.key]: event.target.value })} />
            ) : (
              <input value={profile[field.key] || ""} onChange={(event) => setProfile({ ...profile, [field.key]: event.target.value })} />
            )}
          </label>
        ))}
        <label className="admin-file-field">
          <span>{isArabic ? "صورة الدكتور" : "Doctor image"}</span>
          <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void uploadImage(event.target.files?.[0])} />
          {profile.imageUrl ? <img className="admin-cover-preview" src={profile.imageUrl} alt="" /> : null}
        </label>
        {message ? <p className="admin-form-message">{message}</p> : null}
        <button className="primary-button" type="submit">{isArabic ? "حفظ بيانات الدكتور" : "Save Doctor Profile"}</button>
      </form>
    </section>
  );
}

type ServiceFormState = {
  id?: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionAr: string;
  descriptionEn: string;
  whatsappMessageAr: string;
  whatsappMessageEn: string;
  icon: string;
  sortOrder: number;
  featured: boolean;
  status: "published" | "draft";
};

const emptyServiceForm: ServiceFormState = {
  slug: "",
  titleEn: "",
  titleAr: "",
  descriptionAr: "",
  descriptionEn: "",
  whatsappMessageAr: "",
  whatsappMessageEn: "",
  icon: "/icons/implant.png",
  sortOrder: 0,
  featured: true,
  status: "published",
};

function ServicesManager({ isArabic }: { isArabic: boolean }) {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState<ServiceFormState>(emptyServiceForm);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/services?pageSize=25");
    if (response.ok) setItems(((await response.json()) as { items: ServiceItem[] }).items);
  }

  useEffect(() => {
    void load();
  }, []);

  function edit(item: ServiceItem) {
    setForm({
      id: item.id,
      slug: item.slug,
      titleEn: item.title_en,
      titleAr: item.title_ar,
      descriptionAr: item.description_ar,
      descriptionEn: item.description_en,
      whatsappMessageAr: item.whatsapp_message_ar || "",
      whatsappMessageEn: item.whatsapp_message_en || "",
      icon: item.icon,
      sortOrder: item.sort_order,
      featured: Boolean(item.featured),
      status: item.status === "draft" ? "draft" : "published",
    });
  }

  async function uploadIcon(file: File | undefined) {
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (url) setForm({ ...form, icon: url });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/services", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMessage(response.ok ? (isArabic ? "تم حفظ الخدمة." : "Service saved.") : (isArabic ? "تعذر حفظ الخدمة." : "Could not save service."));
    if (response.ok) {
      setForm(emptyServiceForm);
      await load();
      refreshAdminLivePreview();
    }
  }

  async function remove(id: number) {
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="admin-workspace-grid">
      <section className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-data-table">
            <thead><tr><th>{isArabic ? "الخدمة" : "Service"}</th><th>{isArabic ? "الترتيب" : "Order"}</th><th>{isArabic ? "الحالة" : "Status"}</th><th>{isArabic ? "إجراءات" : "Actions"}</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><strong>{isArabic ? item.title_ar : item.title_en}</strong><small>{item.slug}</small></td>
                  <td>{item.sort_order}</td>
                  <td><AdminStatusBadge status={item.status || "published"} isArabic={isArabic} /></td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => edit(item)}>{isArabic ? "تعديل" : "Edit"}</button><button className="danger" type="button" onClick={() => void remove(item.id)}>{isArabic ? "حذف" : "Delete"}</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="admin-editor-card">
        <h3>{form.id ? (isArabic ? "تعديل خدمة" : "Edit Service") : (isArabic ? "خدمة جديدة" : "New Service")}</h3>
        <form className="admin-form admin-editor-form" onSubmit={save}>
          <label><span>Slug</span><input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
          <label><span>{isArabic ? "العنوان عربي" : "Arabic title"}</span><input required value={form.titleAr} onChange={(event) => setForm({ ...form, titleAr: event.target.value })} /></label>
          <label><span>{isArabic ? "العنوان إنجليزي" : "English title"}</span><input required value={form.titleEn} onChange={(event) => setForm({ ...form, titleEn: event.target.value })} /></label>
          <label><span>{isArabic ? "الوصف عربي" : "Arabic description"}</span><textarea value={form.descriptionAr} onChange={(event) => setForm({ ...form, descriptionAr: event.target.value })} /></label>
          <label><span>{isArabic ? "الوصف إنجليزي" : "English description"}</span><textarea value={form.descriptionEn} onChange={(event) => setForm({ ...form, descriptionEn: event.target.value })} /></label>
          <label><span>{isArabic ? "رسالة واتساب عربي" : "Arabic WhatsApp message"}</span><textarea value={form.whatsappMessageAr} onChange={(event) => setForm({ ...form, whatsappMessageAr: event.target.value })} placeholder={isArabic ? "مثال: مرحباً، محتاج استشارة زراعة الأسنان..." : "Example: Hello, I need a dental implants consultation..."} /></label>
          <label><span>{isArabic ? "رسالة واتساب إنجليزي" : "English WhatsApp message"}</span><textarea value={form.whatsappMessageEn} onChange={(event) => setForm({ ...form, whatsappMessageEn: event.target.value })} /></label>
          <label><span>{isArabic ? "ترتيب الظهور" : "Sort order"}</span><input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label>
          <AdminIconPicker label={isArabic ? "أيقونة جاهزة للخدمة" : "Service icon preset"} value={form.icon.startsWith("/") ? "" : form.icon} onChange={(icon) => setForm({ ...form, icon })} isArabic={isArabic} />
          <label className="admin-file-field"><span>{isArabic ? "أو ارفع صورة/أيقونة مخصصة" : "Or upload a custom image/icon"}</span><input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void uploadIcon(event.target.files?.[0])} />{form.icon ? <img className="admin-upload-preview" src={form.icon} alt="" /> : null}</label>
          <label className="admin-check"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /><span>{isArabic ? "مميزة في الهوم" : "Featured on homepage"}</span></label>
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "published" | "draft" })}><option value="published">{isArabic ? "منشورة" : "Published"}</option><option value="draft">{isArabic ? "مسودة" : "Draft"}</option></select>
          {message ? <p className="admin-form-message">{message}</p> : null}
          <div className="admin-editor-actions"><button className="primary-button" type="submit">{isArabic ? "حفظ الخدمة" : "Save Service"}</button>{form.id ? <button className="secondary-button" type="button" onClick={() => setForm(emptyServiceForm)}>{isArabic ? "إلغاء" : "Cancel"}</button> : null}</div>
        </form>
      </section>
    </div>
  );
}

type AdminBooking = { id: number; name: string; phone?: string; service?: string; message?: string; preferred_date?: string; status: "new" | "contacted" | "closed"; created_at?: string };

function BookingsManager({ isArabic, onStatsChange }: { isArabic: boolean; onStatsChange: () => Promise<void> }) {
  const [items, setItems] = useState<AdminBooking[]>([]);
  const [status, setStatus] = useState<"all" | "new" | "contacted" | "closed">("new");

  async function load() {
    const response = await fetch(`/api/admin/bookings?status=${status}&pageSize=25`);
    if (response.ok) setItems(((await response.json()) as { items: AdminBooking[] }).items);
  }

  useEffect(() => {
    void load();
  }, [status]);

  async function update(id: number, nextStatus: "new" | "contacted" | "closed") {
    await fetch("/api/admin/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: nextStatus }) });
    await load();
    await onStatsChange();
  }

  return (
    <section className="admin-table-card">
      <div className="admin-tools-row">
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
          <option value="all">{isArabic ? "كل الرسائل" : "All bookings"}</option>
          <option value="new">{isArabic ? "جديد" : "New"}</option>
          <option value="contacted">{isArabic ? "تم التواصل" : "Contacted"}</option>
          <option value="closed">{isArabic ? "مغلق" : "Closed"}</option>
        </select>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead><tr><th>{isArabic ? "المريض" : "Patient"}</th><th>{isArabic ? "الخدمة" : "Service"}</th><th>{isArabic ? "الرسالة" : "Message"}</th><th>{isArabic ? "الحالة" : "Status"}</th><th>{isArabic ? "إجراءات" : "Actions"}</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong><small>{item.phone}</small></td>
                <td>{item.service || "-"}</td>
                <td>{item.message || item.preferred_date || "-"}</td>
                <td><AdminStatusBadge status={item.status} isArabic={isArabic} /></td>
                <td><div className="admin-row-actions"><button type="button" onClick={() => void update(item.id, "contacted")}>{isArabic ? "تم التواصل" : "Contacted"}</button><button type="button" onClick={() => void update(item.id, "closed")}>{isArabic ? "إغلاق" : "Close"}</button></div></td>
              </tr>
            ))}
            {!items.length ? <tr><td colSpan={5}>{isArabic ? "لا توجد رسائل حجز." : "No bookings found."}</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type AdminFaq = FaqItem & { status: "published" | "draft" };

function FaqManager({ isArabic }: { isArabic: boolean }) {
  const [items, setItems] = useState<AdminFaq[]>([]);
  const [form, setForm] = useState({ id: 0, questionAr: "", questionEn: "", answerAr: "", answerEn: "", page: "services", sortOrder: 0, status: "published" as "published" | "draft" });
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/faq?pageSize=25");
    if (response.ok) setItems(((await response.json()) as { items: AdminFaq[] }).items);
  }

  useEffect(() => { void load(); }, []);

  function edit(item: AdminFaq) {
    setForm({ id: item.id, questionAr: item.question_ar, questionEn: item.question_en, answerAr: item.answer_ar, answerEn: item.answer_en, page: item.page, sortOrder: item.sort_order, status: item.status });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/faq", { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setMessage(response.ok ? (isArabic ? "تم حفظ السؤال." : "FAQ saved.") : (isArabic ? "تعذر الحفظ." : "Could not save."));
    if (response.ok) {
      setForm({ id: 0, questionAr: "", questionEn: "", answerAr: "", answerEn: "", page: "services", sortOrder: 0, status: "published" });
      await load();
      refreshAdminLivePreview();
    }
  }

  async function remove(id: number) {
    await fetch(`/api/admin/faq?id=${id}`, { method: "DELETE" });
    await load();
    refreshAdminLivePreview();
  }

  return (
    <div className="admin-workspace-grid">
      <section className="admin-table-card">
        <div className="admin-table-wrap"><table className="admin-data-table">
          <thead><tr><th>{isArabic ? "السؤال" : "Question"}</th><th>{isArabic ? "الصفحة" : "Page"}</th><th>{isArabic ? "إجراءات" : "Actions"}</th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.id}><td><strong>{isArabic ? item.question_ar : item.question_en}</strong><small>{item.status}</small></td><td>{item.page}</td><td><div className="admin-row-actions"><button type="button" onClick={() => edit(item)}>{isArabic ? "تعديل" : "Edit"}</button><button className="danger" type="button" onClick={() => void remove(item.id)}>{isArabic ? "حذف" : "Delete"}</button></div></td></tr>)}</tbody>
        </table></div>
      </section>
      <section className="admin-editor-card">
        <h3>{isArabic ? "سؤال شائع" : "FAQ Item"}</h3>
        <form className="admin-form admin-editor-form" onSubmit={save}>
          <input placeholder={isArabic ? "السؤال عربي" : "Arabic question"} value={form.questionAr} onChange={(event) => setForm({ ...form, questionAr: event.target.value })} />
          <input placeholder={isArabic ? "السؤال إنجليزي" : "English question"} value={form.questionEn} onChange={(event) => setForm({ ...form, questionEn: event.target.value })} />
          <textarea placeholder={isArabic ? "الإجابة عربي" : "Arabic answer"} value={form.answerAr} onChange={(event) => setForm({ ...form, answerAr: event.target.value })} />
          <textarea placeholder={isArabic ? "الإجابة إنجليزي" : "English answer"} value={form.answerEn} onChange={(event) => setForm({ ...form, answerEn: event.target.value })} />
          <select value={form.page} onChange={(event) => setForm({ ...form, page: event.target.value })}><option value="services">Services</option><option value="contact">Contact</option><option value="all">All</option></select>
          <input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "published" | "draft" })}><option value="published">Published</option><option value="draft">Draft</option></select>
          {message ? <p className="admin-form-message">{message}</p> : null}
          <button className="primary-button" type="submit">{isArabic ? "حفظ السؤال" : "Save FAQ"}</button>
        </form>
      </section>
    </div>
  );
}

function SeoManager({ isArabic }: { isArabic: boolean }) {
  const pages = ["/", "/about", "/services", "/cases", "/reviews", "/blog", "/contact"];
  const [seoPages, setSeoPages] = useState<Record<string, { title?: string; description?: string; ogImage?: string }>>({});
  const [active, setActive] = useState("/");
  const [message, setMessage] = useState("");
  const current = seoPages[active] || {};

  useEffect(() => {
    void fetch("/api/admin/config").then(async (response) => {
      if (response.ok) setSeoPages(((await response.json()) as { seoPages: Record<string, { title?: string; description?: string; ogImage?: string }> }).seoPages || {});
    });
  }, []);

  async function uploadOg(file: File | undefined) {
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (url) setSeoPages({ ...seoPages, [active]: { ...current, ogImage: url } });
  }

  async function save() {
    const response = await fetch("/api/admin/config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seoPages }) });
    setMessage(response.ok ? (isArabic ? "تم حفظ SEO." : "SEO saved.") : (isArabic ? "تعذر الحفظ." : "Could not save."));
    if (response.ok) refreshAdminLivePreview();
  }

  return (
    <section className="admin-editor-card admin-settings-card">
      <h3>{isArabic ? "إدارة SEO للصفحات" : "Page SEO Manager"}</h3>
      <div className="admin-tabs">{pages.map((pagePath) => <button className={active === pagePath ? "active" : ""} type="button" onClick={() => setActive(pagePath)} key={pagePath}>{pagePath}</button>)}</div>
      <div className="admin-form admin-editor-form">
        <label><span>Title</span><input value={current.title || ""} onChange={(event) => setSeoPages({ ...seoPages, [active]: { ...current, title: event.target.value } })} /></label>
        <label><span>Description</span><textarea maxLength={160} value={current.description || ""} onChange={(event) => setSeoPages({ ...seoPages, [active]: { ...current, description: event.target.value } })} /></label>
        <label className="admin-file-field"><span>Open Graph Image</span><input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void uploadOg(event.target.files?.[0])} />{current.ogImage ? <img className="admin-cover-preview" src={current.ogImage} alt="" /> : null}</label>
        {message ? <p className="admin-form-message">{message}</p> : null}
        <button className="primary-button" type="button" onClick={() => void save()}>{isArabic ? "حفظ SEO" : "Save SEO"}</button>
      </div>
    </section>
  );
}

type MediaItem = { id: number; url: string; alt?: string; category: string; created_at?: string };

function MediaManager({ isArabic }: { isArabic: boolean }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/media?pageSize=25");
    if (response.ok) setItems(((await response.json()) as { items: MediaItem[] }).items);
  }

  useEffect(() => {
    void load();
  }, []);

  async function upload(file: File | undefined) {
    const url = await uploadAdminImage(file, isArabic, setMessage);
    if (!url) return;
    await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, category: "library" }) });
    await load();
  }

  async function uploadMany(files: FileList | File[]) {
    const selected = Array.from(files).filter((file) => allowedAdminImageTypes.includes(file.type));
    for (const file of selected) {
      const url = await uploadAdminImage(file, isArabic, setMessage);
      if (url) {
        await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, alt: file.name.replace(/\.[^.]+$/, ""), category: "library" }) });
      }
    }
    await load();
    setDragging(false);
  }

  async function update(item: MediaItem, updates: Partial<MediaItem>) {
    const next = { ...item, ...updates };
    await fetch("/api/admin/media", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    setItems((current) => current.map((entry) => entry.id === item.id ? next : entry));
  }

  async function remove(id: number) {
    await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <section className="admin-editor-card admin-settings-card">
      <h3>{isArabic ? "مكتبة صور الموقع" : "Media Library"}</h3>
      <div
        className={dragging ? "media-drop-zone dragging" : "media-drop-zone"}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); void uploadMany(event.dataTransfer.files); }}
      >
        <ImageIcon size={28} />
        <strong>{isArabic ? "اسحب الصور هنا" : "Drop images here"}</strong>
        <span>{isArabic ? "رفع جماعي مع ضغط وواترمارك تلقائي" : "Bulk upload with automatic compression and watermark"}</span>
        <label><input multiple type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => event.target.files ? void uploadMany(event.target.files) : undefined} />{isArabic ? "اختيار صور" : "Choose images"}</label>
      </div>
      <label className="admin-file-field"><span>{isArabic ? "رفع صورة واحدة" : "Upload one image"}</span><input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => void upload(event.target.files?.[0])} /></label>
      {message ? <p className="admin-form-message">{message}</p> : null}
      <div className="admin-media-grid">
        {items.map((item) => (
          <article key={item.id}>
            <img src={item.url} alt={item.alt || ""} loading="lazy" />
            <input readOnly value={item.url} onFocus={(event) => event.currentTarget.select()} />
            <input value={item.alt || ""} onChange={(event) => void update(item, { alt: event.target.value })} placeholder="Alt text" />
            <select value={item.category} onChange={(event) => void update(item, { category: event.target.value })}>
              <option value="library">Library</option>
              <option value="hero">Hero</option>
              <option value="article">Article</option>
              <option value="cases">Cases</option>
              <option value="clinic">Clinic</option>
            </select>
            <div className="admin-row-actions">
              <button type="button" onClick={() => void navigator.clipboard.writeText(item.url)}>{isArabic ? "نسخ الرابط" : "Copy URL"}</button>
              <button className="danger" type="button" onClick={() => void remove(item.id)}>{isArabic ? "حذف" : "Delete"}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type ActivityItem = { id: number; actor: string; action: string; entity: string; entity_id?: string; details?: string; created_at: string };

function ActivityManager({ isArabic }: { isArabic: boolean }) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  useEffect(() => {
    void fetch("/api/admin/activity?pageSize=25").then(async (response) => {
      if (response.ok) setItems(((await response.json()) as { items: ActivityItem[] }).items);
    });
  }, []);

  return (
    <section className="admin-table-card">
      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead><tr><th>{isArabic ? "الفعل" : "Action"}</th><th>{isArabic ? "العنصر" : "Entity"}</th><th>{isArabic ? "التاريخ" : "Date"}</th></tr></thead>
          <tbody>
            {items.map((item) => <tr key={item.id}><td><strong>{item.action}</strong><small>{item.actor}</small></td><td>{item.entity} #{item.entity_id}</td><td>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</td></tr>)}
            {!items.length ? <tr><td colSpan={3}>{isArabic ? "لا يوجد نشاط مسجل." : "No activity yet."}</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type AnalyticsItem = { key: string; value: number; updated_at?: string };

function AnalyticsManager({ isArabic }: { isArabic: boolean }) {
  const [items, setItems] = useState<AnalyticsItem[]>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics").then(async (response) => {
      if (response.ok) setItems(((await response.json()) as { items: AnalyticsItem[] }).items);
    });
  }, []);
  return (
    <section className="admin-table-card">
      <div className="admin-table-wrap"><table className="admin-data-table">
        <thead><tr><th>{isArabic ? "المؤشر" : "Metric"}</th><th>{isArabic ? "القيمة" : "Value"}</th><th>{isArabic ? "آخر تحديث" : "Updated"}</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.key}><td><strong>{item.key}</strong></td><td>{item.value}</td><td>{item.updated_at || ""}</td></tr>)}</tbody>
      </table></div>
    </section>
  );
}

type AdminUser = { id: number; username: string; role: string; permissions: string; status: "active" | "disabled" };

function UsersManager({ isArabic }: { isArabic: boolean }) {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [form, setForm] = useState({ id: 0, username: "", password: "", role: "assistant", permissions: [] as string[], status: "active" as "active" | "disabled" });
  const [message, setMessage] = useState("");
  const permissionOptions = ["all", "dashboard", "articles", "reviews", "gallery", "services", "media", "settings", "bookings", "analytics", "backup", "security", "users"];
  async function load() {
    const response = await fetch("/api/admin/users?pageSize=25");
    if (response.ok) setItems(((await response.json()) as { items: AdminUser[] }).items);
  }
  useEffect(() => { void load(); }, []);
  function edit(item: AdminUser) {
    let permissions: string[] = [];
    try {
      const parsed = JSON.parse(item.permissions || "[]");
      permissions = Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      permissions = [];
    }
    setForm({ id: item.id, username: item.username, password: "", role: item.role, permissions, status: item.status });
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/users", { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? (isArabic ? "تم حفظ المستخدم." : "User saved.") : payload.error || (isArabic ? "تعذر الحفظ." : "Could not save."));
    if (response.ok) { setForm({ id: 0, username: "", password: "", role: "assistant", permissions: [], status: "active" }); await load(); }
  }
  return (
    <div className="admin-workspace-grid">
      <section className="admin-table-card"><div className="admin-table-wrap"><table className="admin-data-table"><thead><tr><th>User</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.username}</strong></td><td>{item.role}</td><td>{item.status}</td><td><button type="button" onClick={() => edit(item)}>{isArabic ? "تعديل" : "Edit"}</button></td></tr>)}</tbody></table></div></section>
      <section className="admin-editor-card"><h3>{isArabic ? "مستخدم لوحة التحكم" : "Admin User"}</h3><form className="admin-form admin-editor-form" onSubmit={save}>
        <input placeholder="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        <input type="password" placeholder={form.id ? (isArabic ? "كلمة سر جديدة اختياري" : "Optional new password") : "Password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="super-admin">Super Admin</option><option value="content-writer">Content Writer</option><option value="moderator">Moderator</option><option value="doctor">Doctor</option><option value="assistant">Assistant</option><option value="editor">Editor</option><option value="admin">Legacy Admin</option></select>
        <div className="admin-checkbox-grid">{permissionOptions.map((permission) => <label key={permission}><input type="checkbox" checked={form.permissions.includes(permission)} onChange={(event) => setForm({ ...form, permissions: event.target.checked ? [...form.permissions, permission] : form.permissions.filter((item) => item !== permission) })} /> {permission}</label>)}</div>
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "active" | "disabled" })}><option value="active">Active</option><option value="disabled">Disabled</option></select>
        {message ? <p className="admin-form-message">{message}</p> : null}<button className="primary-button" type="submit">{isArabic ? "حفظ المستخدم" : "Save User"}</button>
      </form></section>
    </div>
  );
}

function ImportManager({ isArabic }: { isArabic: boolean }) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  async function restore() {
    try {
      const payload = JSON.parse(text);
      const response = await fetch("/api/admin/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      setMessage(response.ok ? (isArabic ? `تم الاستيراد: ${result.importedSettings} إعدادات.` : `Imported ${result.importedSettings} settings.`) : result.error);
      if (response.ok) refreshAdminLivePreview();
    } catch {
      setMessage(isArabic ? "ملف JSON غير صحيح." : "Invalid JSON.");
    }
  }
  return (
    <section className="admin-editor-card admin-settings-card">
      <h3>{isArabic ? "استيراد/استرجاع Backup" : "Import / Restore Backup"}</h3>
      <textarea className="admin-import-area" value={text} onChange={(event) => setText(event.target.value)} placeholder={isArabic ? "الصق محتوى ملف JSON هنا" : "Paste backup JSON here"} />
      {message ? <p className="admin-form-message">{message}</p> : null}
      <button className="primary-button" type="button" onClick={() => void restore()}>{isArabic ? "استرجاع النسخة" : "Restore Backup"}</button>
    </section>
  );
}

function SecurityManager({ isArabic }: { isArabic: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [readiness, setReadiness] = useState<Array<{ key: string; label: string; ok: boolean; hint: string }>>([]);

  async function loadReadiness() {
    const response = await fetch("/api/admin/readiness");
    if (response.ok) {
      const payload = await response.json() as { checks: Array<{ key: string; label: string; ok: boolean; hint: string }> };
      setReadiness(payload.checks || []);
    }
  }

  useEffect(() => {
    void loadReadiness();
  }, []);

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? (isArabic ? "تم تغيير كلمة السر بنجاح." : "Password changed successfully.") : (payload.error || (isArabic ? "تعذر تغيير كلمة السر." : "Could not change password.")));
    if (response.ok) {
      setCurrentPassword("");
      setNewPassword("");
    }
  }

  return (
    <div className="admin-workspace-grid">
      <section className="admin-editor-card">
        <h3>{isArabic ? "تغيير كلمة السر" : "Change Password"}</h3>
        <form className="admin-form admin-editor-form" onSubmit={changePassword}>
          <label><span>{isArabic ? "كلمة السر الحالية" : "Current password"}</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
          <label><span>{isArabic ? "كلمة السر الجديدة" : "New password"}</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
          {message ? <p className="admin-form-message">{message}</p> : null}
          <button className="primary-button" type="submit">{isArabic ? "تغيير كلمة السر" : "Change Password"}</button>
        </form>
      </section>
      <section className="admin-editor-card admin-settings-card">
        <h3>{isArabic ? "نسخة احتياطية" : "Backup Export"}</h3>
        <p>{isArabic ? "نزّل نسخة JSON من بيانات الموقع قبل أي تعديل كبير." : "Download a JSON backup before major changes."}</p>
        <a className="secondary-button" href="/api/admin/export" target="_blank" rel="noreferrer">{isArabic ? "تحميل النسخة الاحتياطية" : "Download Backup"}</a>
      </section>
      <section className="admin-editor-card admin-settings-card admin-readiness-card">
        <div className="admin-quick-head">
          <div>
            <h3>{isArabic ? "جاهزية النشر" : "Production Readiness"}</h3>
            <span>{isArabic ? "فحص سريع لأهم نقاط الأمان والتشغيل قبل رفع الموقع." : "A quick check for the most important launch and security items."}</span>
          </div>
          <button className="secondary-button" type="button" onClick={() => void loadReadiness()}>{isArabic ? "إعادة الفحص" : "Recheck"}</button>
        </div>
        <div className="admin-readiness-list">
          {readiness.map((check) => (
            <article className={check.ok ? "ready" : "warn"} key={check.key}>
              <strong>{check.ok ? "✓" : "!"} {check.label}</strong>
              <span>{check.hint}</span>
            </article>
          ))}
          {!readiness.length ? <p>{isArabic ? "جاري تحميل الفحص..." : "Loading checks..."}</p> : null}
        </div>
      </section>
    </div>
  );
}


function AdminStatusBadge({ status, isArabic }: { status: string; isArabic: boolean }) {
  const normalized = status === "published" ? "approved" : status;
  const label = normalized === "published" || normalized === "approved"
    ? (isArabic ? "موافق عليه" : "Approved")
    : normalized === "new"
      ? (isArabic ? "جديد" : "New")
      : normalized === "contacted"
        ? (isArabic ? "تم التواصل" : "Contacted")
        : normalized === "closed"
          ? (isArabic ? "مغلق" : "Closed")
    : normalized === "draft"
      ? (isArabic ? "مسودة" : "Draft")
      : normalized === "rejected"
        ? (isArabic ? "مرفوض" : "Rejected")
        : (isArabic ? "قيد المراجعة" : "Pending");

  return <span className={`admin-status-badge ${normalized}`}>{label}</span>;
}

function AdminPagination({ page, totalPages, isArabic, onPageChange }: { page: number; totalPages: number; isArabic: boolean; onPageChange: (page: number) => void }) {
  return (
    <div className="admin-pagination" aria-label={isArabic ? "التنقل بين الصفحات" : "Pagination"}>
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>{isArabic ? "السابق" : "Previous"}</button>
      <span>{page} / {totalPages}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>{isArabic ? "التالي" : "Next"}</button>
    </div>
  );
}
