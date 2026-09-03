import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

type ReviewPayload = {
  id?: number;
  name?: string;
  rating?: number;
  message?: string;
  status?: string;
};

type ArticlePayload = {
  id?: number;
  title?: string;
  slug?: string;
  metaDescription?: string;
  meta_description?: string;
  coverImage?: string;
  cover_image?: string;
  body?: string;
  conclusion?: string;
  status?: string;
  publishAt?: string;
  publish_at?: string;
};

type GalleryPayload = {
  id?: number;
  title?: string;
  category?: string;
  image?: string;
  before_image?: string;
  after_image?: string;
  beforeImage?: string;
  afterImage?: string;
  duration?: string;
  featured?: boolean;
  featuredRaw?: number;
  status?: string;
  publishAt?: string;
  publish_at?: string;
};

type SettingsPayload = Record<string, unknown>;
type ServicePayload = Record<string, unknown>;
type BookingPayload = Record<string, unknown>;
type MediaPayload = Record<string, unknown>;
type UserPayload = Record<string, unknown>;

const defaultReviews = [
  ["Kareem Y.", 5, "فريق طبي ممتاز، دكاترة ومساعدين واستقبال. كل تخصص له الدكتور المختص فيه، وده شيء ممتاز جدا. نظافة ونظام في المواعيد ورقي في التعامل مع العيانين.", "published"],
  ["Areej M.", 5, "دكتور شاطر جدا وكان صبور جدا معايا وبيشرحلي كل حاجة بتتعمل. بجد تسلم إيدك.", "published"],
  ["Ahmed m.", 5, "It was a very great clinic. No waiting time and everyone was very kind and respectful. The staff was amazing. Highly recommended.", "published"],
];

const defaultArticles = [
  [
    "هل علاج العصب مؤلم؟",
    "علاج العصب الحديث هدفه تقليل الألم والحفاظ على السن. بنشرح سبب الألم وخطوات العلاج قبل البداية عشان التجربة تكون أهدى.",
    "الكشف المبكر وشرح الخطة بوضوح بيخلوا علاج العصب أسهل وأقل توتراً.",
  ],
  [
    "إمتى أحتاج زراعة أسنان؟",
    "زراعة الأسنان قد تكون مناسبة عند فقد سن أو أكثر والحاجة لتعويض ثابت يشبه الشكل والوظيفة الطبيعية. القرار يعتمد على حالة العظم واللثة.",
    "استشارة الزراعة بتحدد هل الزراعة أنسب حل لحالتك أم يوجد بديل أفضل.",
  ],
  [
    "هل تبييض الأسنان آمن لكل الناس؟",
    "التبييض مناسب لحالات كثيرة، لكن الأفضل معرفة سبب تغير اللون أولاً. أحياناً نحتاج تنظيف أو علاج قبل التبييض للحصول على نتيجة آمنة.",
    "الكشف البسيط يحدد الطريقة الآمنة والنتيجة المتوقعة.",
  ],
];

const defaultFaqItems = [
  [
    "هل علاج العصب مؤلم؟",
    "Is root canal treatment painful?",
    "مع التخدير والخطوات الحديثة غالباً يكون علاج العصب مريح، والأهم إن الحالة تتشرح قبل البداية عشان المريض يبقى مطمئن.",
    "With anesthesia and modern steps, root canal treatment is usually comfortable. Clear explanation before treatment helps the patient feel reassured.",
    "blog",
    1,
  ],
  [
    "إمتى أحتاج زراعة أسنان؟",
    "When do I need a dental implant?",
    "زراعة الأسنان قد تكون مناسبة عند فقد سن أو أكثر، لكن القرار يعتمد على حالة العظم واللثة وخطة التعويض المناسبة.",
    "Dental implants may be suitable after losing one or more teeth, depending on bone, gum health, and the best replacement plan.",
    "services",
    2,
  ],
  [
    "هل تبييض الأسنان آمن؟",
    "Is teeth whitening safe?",
    "التبييض يكون آمن عندما يتم اختيار الطريقة المناسبة بعد الكشف ومعرفة سبب تغير لون الأسنان.",
    "Whitening is safe when the suitable method is selected after an exam and after understanding the cause of discoloration.",
    "services",
    3,
  ],
];

const defaultGallery = [
  ["حالة تجميل ابتسامة", "Cosmetic Dentistry", "/cases/case-1.jpg"],
  ["تنظيف وتلميع", "Dental Care", "/cases/case-2.png"],
  ["تركيبات تجميلية", "Prosthodontics", "/cases/case-3.jpg"],
  ["علاج وتجميل", "Smile Makeover", "/cases/case-4.jpg"],
  ["نتيجة علاج", "Before & After", "/cases/case-5.jpg"],
  ["حالة عناية كاملة", "Family Dentistry", "/cases/case-6.jpg"],
];

const defaultServiceItems = [
  ["dental-implants", "Dental Implants", "زراعة الأسنان", "تعويض الأسنان المفقودة بشكل ثابت وطبيعي.", "Stable, natural-looking replacement for missing teeth.", "/icons/implant.png", 1, "مرحباً، محتاج استشارة زراعة الأسنان في عيادة Dr. Amr Elshamy.", "Hello, I need a dental implants consultation at Dr. Amr Elshamy Dental Clinic."],
  ["root-canal", "Root Canal Treatment", "علاج العصب", "علاج الألم والحفاظ على السن بخطوات مريحة.", "Pain relief and tooth saving with a gentle process.", "/icons/root-canal.png", 2, "مرحباً، محتاج استشارة علاج عصب في عيادة Dr. Amr Elshamy.", "Hello, I need a root canal consultation at Dr. Amr Elshamy Dental Clinic."],
  ["cosmetic-dentistry", "Cosmetic Dentistry", "تجميل الأسنان", "فينير، بوندنج، وتنسيق الابتسامة.", "Veneers, bonding, and smile design.", "/icons/whitening.png", 3, "مرحباً، محتاج استشارة تجميل الأسنان في عيادة Dr. Amr Elshamy.", "Hello, I need a cosmetic dentistry consultation at Dr. Amr Elshamy Dental Clinic."],
  ["orthodontics", "Orthodontics", "تقويم الأسنان", "حلول تقويم للكبار والأطفال.", "Alignment options for adults and children.", "/icons/aligners.png", 4, "مرحباً، محتاج استشارة تقويم الأسنان في عيادة Dr. Amr Elshamy.", "Hello, I need an orthodontics consultation at Dr. Amr Elshamy Dental Clinic."],
  ["teeth-whitening", "Teeth Whitening", "تبييض الأسنان", "تفتيح آمن للون الأسنان وابتسامة أوضح.", "Safe whitening for a brighter smile.", "/icons/whitening.png", 5, "مرحباً، محتاج استشارة تبييض الأسنان في عيادة Dr. Amr Elshamy.", "Hello, I need a teeth whitening consultation at Dr. Amr Elshamy Dental Clinic."],
  ["pediatric-dentistry", "Pediatric Dentistry", "أسنان الأطفال", "تعامل هادي وودود مع الأطفال.", "Friendly, calm care for children.", "/icons/comfort-face.png", 6, "مرحباً، محتاج استشارة أسنان أطفال في عيادة Dr. Amr Elshamy.", "Hello, I need a pediatric dentistry consultation at Dr. Amr Elshamy Dental Clinic."],
  ["dental-fillings", "Dental Fillings", "الحشو التجميلي", "حشوات بلون السن للحفاظ على الشكل والوظيفة.", "Tooth-colored fillings for form and function.", "/icons/root-canal.png", 7, "مرحباً، محتاج استشارة حشو تجميلي في عيادة Dr. Amr Elshamy.", "Hello, I need a dental fillings consultation at Dr. Amr Elshamy Dental Clinic."],
  ["oral-surgery", "Oral Surgery", "جراحة الفم", "خلع وجراحات بسيطة باهتمام كامل بالراحة.", "Simple surgical care with comfort in mind.", "/icons/sterilization-shield.png", 8, "مرحباً، محتاج استشارة جراحة الفم في عيادة Dr. Amr Elshamy.", "Hello, I need an oral surgery consultation at Dr. Amr Elshamy Dental Clinic."],
];

const defaultSettings = {
  phonePrimary: "+20 10 90460873",
  phoneSecondary: "+20 10 95686706",
  whatsappPhone: "201090460873",
  facebookUrl: "https://www.facebook.com/profile.php?id=61552675595435&mibextid=wwXIfr",
  instagramUrl: "https://www.instagram.com/dramrelshamy.dentist",
  tiktokUrl: "https://www.tiktok.com/@dr..amr.elshamy",
  mapUrl: "https://maps.app.goo.gl/UZEMhEpQh6PuaUDy5?g_st=ic",
  email: "info@dramrelshamy.com",
  homeConfig: JSON.stringify({ serviceIds: [], articleIds: [], caseIds: [], reviewIds: [] }),
  siteText: JSON.stringify({
    servicesLabelAr: "خدماتنا",
    servicesLabelEn: "Our Services",
    servicesTitleAr: "خدمات أسنان شاملة",
    servicesTitleEn: "Comprehensive Dental Solutions",
    servicesTextAr: "كل خدمات الأسنان للكبار والأطفال بخطة واضحة ورسالة واتساب مناسبة لكل خدمة.",
    servicesTextEn: "Complete dental care for adults and children, with clear plans and page-specific WhatsApp booking.",
    reviewsLabelAr: "آراء المرضى",
    reviewsLabelEn: "Patient Reviews",
    reviewsTitleAr: "تجارب حقيقية من مرضانا",
    reviewsTitleEn: "Real Experiences From Our Patients",
    reviewsTextAr: "مختارات حقيقية من آراء المرضى، وتقدر تشوف باقي التجارب كاملة في صفحة آراء المرضى.",
    reviewsTextEn: "Real patient highlights from the reviews page. Open the full page to explore more experiences.",
    reviewsButtonAr: "شوف باقي آراء المرضى",
    reviewsButtonEn: "See More Patient Reviews",
    pageAboutLabelAr: "عن الدكتور",
    pageAboutTitleAr: "دكتور عمرو الشامي",
    pageAboutTextAr: "زيارة الأسنان تبقى أسهل لما الخطة تكون واضحة والتعامل هادي.",
    pageAboutLabelEn: "About Dr. Amr",
    pageAboutTitleEn: "Dr. Amr Elshamy",
    pageAboutTextEn: "Dental visits feel easier when the plan is clear and the care is calm.",
    pageServicesLabelAr: "خدماتنا",
    pageServicesTitleAr: "خدمات أسنان شاملة",
    pageServicesTextAr: "خدمات أسنان علاجية وتجميلية للكبار والأطفال في مكان واحد.",
    pageServicesLabelEn: "Our Services",
    pageServicesTitleEn: "Comprehensive Dental Solutions",
    pageServicesTextEn: "Core and cosmetic dental services for adults and children in one place.",
    pageCasesLabelAr: "قبل وبعد",
    pageCasesTitleAr: "نتائج من شغل العيادة",
    pageCasesTextAr: "صور حقيقية من الحالات المسموح بعرضها.",
    pageCasesLabelEn: "Before & After",
    pageCasesTitleEn: "Clinic Work Gallery",
    pageCasesTextEn: "Real case images approved for display.",
    pageReviewsLabelAr: "آراء المرضى",
    pageReviewsTitleAr: "مرضانا بيقولوا إيه؟",
    pageReviewsTextAr: "اقرأ تجارب المرضى، واكتب رأيك ليظهر بعد موافقة الأدمن.",
    pageReviewsLabelEn: "Testimonials",
    pageReviewsTitleEn: "What Our Patients Say",
    pageReviewsTextEn: "Read patient experiences and submit yours for admin approval.",
    pageBlogLabelAr: "المدونة",
    pageBlogTitleAr: "مقالات ونصائح",
    pageBlogTextAr: "مقالات يضيفها الأدمن لمساعدة المرضى بمعلومات بسيطة ومفيدة.",
    pageBlogLabelEn: "Blog",
    pageBlogTitleEn: "Articles & Tips",
    pageBlogTextEn: "Helpful articles added by the admin for simple patient education.",
    pageContactLabelAr: "تواصل",
    pageContactTitleAr: "احجز زيارتك بخطوة بسيطة",
    pageContactTextAr: "اكتب بياناتك والرسالة هتتجهز تلقائياً على واتساب.",
    pageContactLabelEn: "Contact",
    pageContactTitleEn: "Book your visit in one simple step",
    pageContactTextEn: "Enter your details and the message will be prepared automatically on WhatsApp.",
    trustLabelAr: "ليه تختار العيادة؟",
    trustLabelEn: "Why Choose the Clinic?",
    trustTitleAr: "ثقة مبنية على وضوح وراحة ومتابعة",
    trustTitleEn: "Trust Built on Clarity, Comfort, and Follow-up",
    trustTextAr: "التجربة مش علاج بس؛ المهم إنك تفهم حالتك وتدخل كل خطوة وأنت مطمئن.",
    trustTextEn: "Care is not only treatment; it is understanding your case and feeling confident at every step.",
  }),
  heroConfig: JSON.stringify({
    badgeAr: "رعاية أسنان وتجميل بابتسامة مطمئنة",
    badgeEn: "Premium Dental & Cosmetic Care in Cairo",
    titleAr: "ابتسامتك تبدأ من هنا",
    titleEn: "Your Perfect Smile Starts Here",
    subtitleAr: "في عيادة Dr. Amr Elshamy بنهتم براحتك من أول رسالة واتساب لحد نتيجة العلاج.",
    subtitleEn: "At Dr. Amr Elshamy Dental Clinic, booking is simple, care is gentle, and every treatment plan is explained clearly.",
    doctorImage: "/brand/dr-amr-hero-premium.png",
    teethImage: "/brand/dental-implant-cutout.png",
    primaryCtaAr: "احجز عبر واتساب",
    primaryCtaEn: "Book Appointment",
    secondaryCtaAr: "استكشف الخدمات",
    secondaryCtaEn: "Explore Services",
    metric1: "100/100",
    metric2: "20/100",
    metric3: "15+",
  }),
  themeConfig: JSON.stringify({
    gold: "#D4AF37",
    bronze: "#AA771C",
    charcoal: "#111827",
    background: "#FFFFFF",
    darkModeEnabled: true,
    buttonStyle: "gradient",
    cardRadius: "18",
    shadowLevel: "medium",
    headingScale: "1",
    bodyScale: "1",
  }),
  layoutConfig: JSON.stringify({
    sections: ["hero", "stats", "trust", "implant", "journey", "quiz", "preview", "comfort", "services", "reviews"],
    hiddenSections: [],
    previewMode: false,
  }),
  headerFooterConfig: JSON.stringify({
    logo: "/brand/logo-transparent.png",
    footerTextAr: "رعاية أسنان ودودة وواضحة لكل أفراد الأسرة.",
    footerTextEn: "Friendly, clear dental care for the whole family.",
    showSocial: true,
    navOrder: ["home", "about", "services", "cases", "reviews", "blog", "contact"],
  }),
  bannerConfig: JSON.stringify({
    enabled: false,
    textAr: "الحجز متاح الآن عبر واتساب",
    textEn: "WhatsApp booking is available now",
    link: "https://wa.me/201090460873",
  }),
  formConfig: JSON.stringify({
    requireName: true,
    requirePhone: false,
    showAge: false,
    showImage: false,
    showDate: true,
    showMessage: true,
  }),
  languageOverrides: JSON.stringify({}),
  scriptsConfig: JSON.stringify({ googleAnalytics: "", metaPixel: "", tiktokPixel: "", googleTagManager: "" }),
  builderConfig: JSON.stringify({
    trustItems: [
      { icon: "whatsapp", ar: "حجز واتساب سريع", en: "Fast WhatsApp booking", enabled: true },
      { icon: "shield", ar: "تعقيم وراحة", en: "Sterilization & comfort", enabled: true },
      { icon: "smile", ar: "تجميل وأسنان عامة", en: "Cosmetic & general dentistry", enabled: true },
      { icon: "users", ar: "مناسب للكبار والأطفال", en: "Adults and kids friendly", enabled: true },
    ],
    journeySteps: [
      { key: "whatsapp", icon: "whatsapp", titleAr: "أول رسالة واتساب", titleEn: "WhatsApp", textAr: "نبعتلك رد سريع ونفهم المشكلة ببساطة.", textEn: "Send a quick message and we understand the concern.", enabled: true },
      { key: "checkup", icon: "search", titleAr: "الكشف", titleEn: "Checkup", textAr: "تشخيص هادئ وصور أو فحص حسب الحالة.", textEn: "A calm checkup with the right diagnosis.", enabled: true },
      { key: "plan", icon: "plan", titleAr: "خطة العلاج", titleEn: "Plan", textAr: "شرح البدائل والتكلفة المتوقعة قبل أي خطوة.", textEn: "Clear options before any treatment step.", enabled: true },
      { key: "care", icon: "treatment", titleAr: "التنفيذ", titleEn: "Care", textAr: "علاج مريح بمعايير تعقيم عالية.", textEn: "Comfort-first treatment with strong sterilization.", enabled: true },
      { key: "follow-up", icon: "follow", titleAr: "المتابعة", titleEn: "Follow-up", textAr: "نطمن على النتيجة ونرد على أي سؤال.", textEn: "Follow-up support after the visit.", enabled: true },
    ],
    quizOptions: [
      { key: "pain", labelAr: "ألم أو عصب", labelEn: "Pain or root canal", messageAr: "عندي ألم أو محتاج كشف عصب", messageEn: "Pain or root canal consultation", enabled: true },
      { key: "cosmetic", labelAr: "تجميل ابتسامة", labelEn: "Cosmetic smile", messageAr: "محتاج حل تجميلي للابتسامة", messageEn: "Cosmetic smile consultation", enabled: true },
      { key: "orthodontics", labelAr: "تقويم", labelEn: "Orthodontics", messageAr: "محتاج أعرف أنسب حل للتقويم", messageEn: "Orthodontics consultation", enabled: true },
      { key: "child", labelAr: "طفل", labelEn: "Child visit", messageAr: "الحجز لطفل ومحتاج تعامل هادي", messageEn: "Child dental visit", enabled: true },
      { key: "implant", labelAr: "زراعة", labelEn: "Implants", messageAr: "محتاج استشارة زراعة أسنان", messageEn: "Dental implant consultation", enabled: true },
    ],
    comfortItems: [
      { ar: "تعقيم واضح", en: "Sterilization", textAr: "كل خطوة علاجية مرتبطة بمسار نظافة وتعقيم مطمئن.", textEn: "Every treatment step follows a reassuring hygiene flow.", image: "/icons/sterilization-shield.png", enabled: true },
      { ar: "شرح قبل العلاج", en: "Clear Explanation", textAr: "بنشرح الحالة والاختيارات بلغة بسيطة قبل التنفيذ.", textEn: "We explain the case and options simply before treatment.", image: "/icons/success-chart.png", enabled: true },
      { ar: "تعامل هادئ مع الأطفال", en: "Kids Friendly", textAr: "الزيارة تكون أهدى وأسهل للأطفال والأهل.", textEn: "Visits feel easier for children and parents.", image: "/icons/comfort-face.png", enabled: true },
      { ar: "متابعة بعد الزيارة", en: "Follow-up", textAr: "تقدر تبعت على واتساب لو عندك سؤال بعد الكشف.", textEn: "You can send WhatsApp questions after the visit.", image: "/icons/trophy.png", enabled: true },
    ],
    patientQuestions: [
      { questionAr: "هل علاج العصب مؤلم؟", questionEn: "Is root canal painful?", answerAr: "العلاج الحديث هدفه تقليل الألم، والخطة بتتشرح قبل البداية.", answerEn: "Modern treatment aims to reduce pain, with the plan explained first.", enabled: true },
      { questionAr: "إمتى أحتاج زراعة؟", questionEn: "When do I need implants?", answerAr: "لما يكون في سن مفقود ومحتاج تعويض ثابت وطبيعي.", answerEn: "When a missing tooth needs a stable, natural replacement.", enabled: true },
      { questionAr: "هل التبييض مناسب لكل الناس؟", questionEn: "Is whitening for everyone?", answerAr: "الأفضل كشف بسيط عشان نحدد سبب اللون وأنسب طريقة.", answerEn: "A quick exam helps choose the safest whitening method.", enabled: true },
    ],
    clinicTour: [
      { image: "/inner/clinic-reception.png", altAr: "استقبال العيادة", altEn: "Clinic reception", enabled: true },
      { image: "/inner/clinic-treatment.png", altAr: "غرفة العلاج", altEn: "Treatment room", enabled: true },
      { image: "/inner/clinic-sterilization.png", altAr: "منطقة التعقيم", altEn: "Sterilization area", enabled: true },
      { image: "/inner/clinic-hallway.png", altAr: "ممر العيادة", altEn: "Clinic hallway", enabled: true },
    ],
    blogThumbs: ["/inner/blog-hygiene.png", "/inner/blog-cosmetic.png", "/inner/blog-aligners.png"],
    implantSection: {},
    previewSection: {},
    casesPage: {},
    articleLabels: {},
  }),
  doctorProfile: JSON.stringify({
    nameAr: "دكتور عمرو الشامي",
    nameEn: "Dr. Amr Elshamy",
    titleAr: "طبيب أسنان وصاحب العيادة",
    titleEn: "Dentist and Clinic Owner",
    bioAr: "نهتم بتقديم تجربة أسنان واضحة ومريحة للكبار والأطفال مع شرح الخطة قبل كل خطوة.",
    bioEn: "Focused on clear, comfortable dental care for adults and children with every plan explained before treatment.",
    certifications: "Dental & Cosmetic Care",
    yearsExperience: "15+",
    imageUrl: "/brand/dr-amr-hero-premium.png",
  }),
  seoPages: JSON.stringify({}),
};
const authCookieName = "admin_auth_token";
const tokenMaxAgeSeconds = 60 * 60 * 8;
const defaultSlugFallback = "article";

type AdminTokenPayload = {
  sub: string;
  role: string;
  permissions?: string[];
  exp: number;
};

type AdminSession = {
  username: string;
  role: string;
  permissions: string[];
};

type SlugLookupDb = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      first: <T = unknown>() => Promise<T | null>;
    };
  };
};

type QueryResult<T = Record<string, unknown>> = {
  results?: T[];
};

type DbStatement = {
  bind: (...values: unknown[]) => DbStatement;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  all: <T = Record<string, unknown>>() => Promise<QueryResult<T>>;
  run: () => Promise<unknown>;
};

type AppDb = {
  prepare: (query: string) => DbStatement;
  batch: (statements: DbStatement[]) => Promise<unknown[]>;
};

type WorkerEnv = {
  DB?: AppDb;
  [key: string]: unknown;
};

type SqliteStatement = {
  get: (...values: unknown[]) => Record<string, unknown> | undefined;
  all: (...values: unknown[]) => Record<string, unknown>[];
  run: (...values: unknown[]) => unknown;
};

let parsedLocalEnv: Record<string, string> | null = null;
let cachedWorkerEnv: WorkerEnv | null | undefined;
let cachedDb: AppDb | null = null;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function localEnvFiles() {
  return [".env.local", ".env", ".dev.vars"];
}

function parseEnvLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const separator = trimmed.indexOf("=");
  if (separator === -1) return null;

  const key = trimmed.slice(0, separator).trim();
  let value = trimmed.slice(separator + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  return key ? [key, value] as const : null;
}

function readLocalEnv() {
  if (parsedLocalEnv) return parsedLocalEnv;

  parsedLocalEnv = {};
  if (typeof process === "undefined") return parsedLocalEnv;

  for (const fileName of localEnvFiles()) {
    const filePath = path.join(process.cwd(), fileName);
    if (!existsSync(filePath)) continue;

    for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const parsed = parseEnvLine(line);
      if (parsed && !parsedLocalEnv[parsed[0]]) {
        parsedLocalEnv[parsed[0]] = parsed[1];
      }
    }
  }

  return parsedLocalEnv;
}

function envValue(key: string) {
  const nodeEnv = typeof process !== "undefined" ? process.env?.[key] : "";
  return nodeEnv || readLocalEnv()[key] || "";
}

async function workerEnv() {
  if (cachedWorkerEnv !== undefined) return cachedWorkerEnv;

  try {
    const module = await import("cloudflare:workers");
    cachedWorkerEnv = (module as { env?: WorkerEnv }).env || null;
  } catch {
    cachedWorkerEnv = null;
  }

  return cachedWorkerEnv;
}

class NodeSqliteStatement implements DbStatement {
  private values: unknown[] = [];

  constructor(private readonly statement: SqliteStatement) {}

  bind(...values: unknown[]) {
    this.values = values;
    return this;
  }

  async first<T = Record<string, unknown>>() {
    return (this.statement.get(...this.values) || null) as T | null;
  }

  async all<T = Record<string, unknown>>() {
    return { results: this.statement.all(...this.values) as T[] };
  }

  async run() {
    return this.statement.run(...this.values);
  }
}

async function createNodeSqliteDb(): Promise<AppDb> {
  const { DatabaseSync } = await import("node:sqlite");
  const configuredPath = envValue("DATABASE_PATH") || path.join("data", "site.sqlite");
  const databasePath = path.isAbsolute(configuredPath)
    ? configuredPath
    : path.join(process.cwd(), configuredPath);

  mkdirSync(path.dirname(databasePath), { recursive: true });
  const sqlite = new DatabaseSync(databasePath);
  sqlite.exec("PRAGMA journal_mode = WAL");
  sqlite.exec("PRAGMA foreign_keys = ON");

  return {
    prepare(query: string) {
      return new NodeSqliteStatement(sqlite.prepare(query) as unknown as SqliteStatement);
    },
    async batch(statements: DbStatement[]) {
      const results: unknown[] = [];
      sqlite.exec("BEGIN");
      try {
        for (const statement of statements) {
          results.push(await statement.run());
        }
        sqlite.exec("COMMIT");
        return results;
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
  };
}

async function resolveDb(): Promise<AppDb> {
  if (cachedDb) return cachedDb;

  const env = await workerEnv();
  cachedDb = env?.DB || await createNodeSqliteDb();
  return cachedDb;
}

function textBytes(value: string) {
  return new TextEncoder().encode(value);
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlEncodeJson(value: unknown) {
  return base64UrlEncode(textBytes(JSON.stringify(value)));
}

function base64UrlDecode(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function timingSafeEqual(a: string, b: string) {
  const left = textBytes(a);
  const right = textBytes(b);
  if (left.length !== right.length) return false;

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }
  return mismatch === 0;
}

async function hmacSha256(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    textBytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, textBytes(data));
  return base64UrlEncode(new Uint8Array(signature));
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", textBytes(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function pbkdf2Hash(password: string, iterations: number, saltBase64Url: string) {
  const keyMaterial = await crypto.subtle.importKey("raw", textBytes(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      iterations,
      salt: base64UrlDecode(saltBase64Url),
    },
    keyMaterial,
    256
  );
  return base64UrlEncode(new Uint8Array(bits));
}

export function adminUsername() {
  return envValue("ADMIN_USERNAME");
}

function adminPasswordHash() {
  return envValue("ADMIN_PASSWORD_HASH");
}

function adminAuthSecret() {
  return envValue("ADMIN_AUTH_SECRET") || envValue("JWT_SECRET");
}

function parsePermissions(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

function permissionForRequest(request: Request) {
  const { pathname } = new URL(request.url);
  if (!pathname.startsWith("/api/admin/")) return "all";
  const key = pathname.split("/")[3] || "dashboard";
  const map: Record<string, string> = {
    activity: "security",
    analytics: "analytics",
    articles: "articles",
    bookings: "bookings",
    config: "settings",
    content: "settings",
    dashboard: "dashboard",
    export: "backup",
    faq: "articles",
    gallery: "gallery",
    import: "backup",
    media: "media",
    password: "security",
    revalidate: "settings",
    readiness: "security",
    reviews: "reviews",
    sections: "settings",
    services: "services",
    settings: "settings",
    upload: "media",
    users: "users",
  };
  return map[key] || key;
}

function requestOriginIsTrusted(request: Request) {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") return true;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (!origin && !referer) return true;

  const current = new URL(request.url);
  const candidates = [origin, referer].filter(Boolean) as string[];
  return candidates.every((value) => {
    try {
      const parsed = new URL(value);
      return parsed.origin === current.origin;
    } catch {
      return false;
    }
  });
}

function hasPermission(session: AdminSession, permission: string) {
  if (session.role === "admin" || session.role === "owner") return true;
  return session.permissions.includes("all") || session.permissions.includes(permission);
}

export function checkLoginRateLimit(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("cf-connecting-ip") || "local";
  const now = Date.now();
  const current = loginAttempts.get(ip);
  if (!current || current.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }

  current.count += 1;
  return current.count <= 8;
}

export function clearLoginRateLimit(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("cf-connecting-ip") || "local";
  loginAttempts.delete(ip);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const configuredUsername = adminUsername();
  let configuredHash = adminPasswordHash();

  try {
    const db = await getDb();
    const user = await db.prepare("SELECT password_hash, status FROM admin_users WHERE username = ? LIMIT 1")
      .bind(username)
      .first<{ password_hash: string; status: string }>();
    if (user?.password_hash && user.status === "active") {
      return verifyPasswordAgainstHash(password, user.password_hash);
    }

    const storedHash = await db.prepare("SELECT value FROM settings WHERE key = ? LIMIT 1").bind("adminPasswordHash").first<{ value: string }>();
    if (storedHash?.value) configuredHash = storedHash.value;
  } catch {
    // If the DB is not ready yet, fall back to the environment password hash.
  }

  if (!configuredUsername || !configuredHash) return false;
  if (!timingSafeEqual(username, configuredUsername)) return false;

  return verifyPasswordAgainstHash(password, configuredHash);
}

async function verifyPasswordAgainstHash(password: string, configuredHash: string) {
  if (configuredHash.startsWith("sha256:")) {
    const expected = configuredHash.slice("sha256:".length);
    return timingSafeEqual(await sha256Hex(password), expected);
  }

  if (configuredHash.startsWith("pbkdf2:")) {
    const [, iterationsRaw, salt, expected] = configuredHash.split(":");
    const iterations = Number(iterationsRaw);
    if (!iterations || !salt || !expected) return false;
    return timingSafeEqual(await pbkdf2Hash(password, iterations, salt), expected);
  }

  return false;
}

export async function hashAdminPassword(password: string) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const iterations = 210000;
  return `pbkdf2:${iterations}:${base64UrlEncode(salt)}:${await pbkdf2Hash(password, iterations, base64UrlEncode(salt))}`;
}

async function adminSessionForUsername(username: string): Promise<AdminSession> {
  try {
    const db = await getDb();
    const user = await db.prepare("SELECT role, permissions, status FROM admin_users WHERE username = ? LIMIT 1")
      .bind(username)
      .first<{ role: string; permissions: string; status: string }>();
    if (user?.status === "active") {
      return { username, role: user.role || "assistant", permissions: parsePermissions(user.permissions) };
    }
  } catch {
    // Environment-only admin accounts are still supported for first deployment.
  }

  return { username, role: "admin", permissions: ["all"] };
}

export async function createAdminToken(username: string) {
  const secret = adminAuthSecret();
  if (!secret) throw new Error("ADMIN_AUTH_SECRET is not configured.");
  const session = await adminSessionForUsername(username);

  const header = base64UrlEncodeJson({ alg: "HS256", typ: "JWT" });
  const payload = base64UrlEncodeJson({
    sub: username,
    role: session.role,
    permissions: session.permissions,
    exp: Math.floor(Date.now() / 1000) + tokenMaxAgeSeconds,
  } satisfies AdminTokenPayload);
  const unsigned = `${header}.${payload}`;
  const signature = await hmacSha256(secret, unsigned);
  return `${unsigned}.${signature}`;
}

async function readAdminSession(token: string): Promise<AdminSession | null> {
  const secret = adminAuthSecret();
  if (!secret) return null;

  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const expectedSignature = await hmacSha256(secret, `${header}.${payload}`);
  if (!timingSafeEqual(signature, expectedSignature)) return null;

  try {
    const decoded = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))) as Partial<AdminTokenPayload>;
    if (!decoded.sub || typeof decoded.exp !== "number" || decoded.exp <= Math.floor(Date.now() / 1000)) return null;
    return {
      username: decoded.sub,
      role: decoded.role || "assistant",
      permissions: Array.isArray(decoded.permissions) ? decoded.permissions.map(String) : [],
    };
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token: string) {
  return Boolean(await readAdminSession(token));
}

function authCookieFlags(request?: Request) {
  const isLocal = request ? new URL(request.url).hostname === "localhost" : false;
  const secure = isLocal ? "" : "; Secure";
  return `Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=${tokenMaxAgeSeconds}`;
}

export function setAdminCookie(token: string, request?: Request) {
  return `${authCookieName}=${token}; ${authCookieFlags(request)}`;
}

export function clearAdminCookie(request?: Request) {
  const isLocal = request ? new URL(request.url).hostname === "localhost" : false;
  const secure = isLocal ? "" : "; Secure";
  return `${authCookieName}=; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=0`;
}

function getCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

export async function isAdmin(request: Request) {
  if (!requestOriginIsTrusted(request)) return false;
  const token = getCookie(request, authCookieName);
  if (!token) return false;
  const session = await readAdminSession(token);
  return session ? hasPermission(session, permissionForRequest(request)) : false;
}

export async function requireAdmin(request: Request) {
  if (await isAdmin(request)) return null;
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function slugifyArticleTitle(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || defaultSlugFallback;
}

export async function uniqueArticleSlug(db: SlugLookupDb, source: string, excludeId?: number) {
  const base = slugifyArticleTitle(source);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = excludeId
      ? await db.prepare("SELECT id FROM articles WHERE slug = ? AND id != ? LIMIT 1").bind(candidate, excludeId).first<{ id: number }>()
      : await db.prepare("SELECT id FROM articles WHERE slug = ? LIMIT 1").bind(candidate).first<{ id: number }>();

    if (!existing) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function getDb() {
  const db = await resolveDb();

  const schemaStatements = [
    "CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, rating INTEGER NOT NULL DEFAULT 5, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL)",
    "CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, meta_description TEXT, cover_image TEXT, body TEXT NOT NULL, conclusion TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'published', created_at TEXT NOT NULL, updated_at TEXT)",
    "CREATE TABLE IF NOT EXISTS gallery_items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, category TEXT NOT NULL, image TEXT NOT NULL, before_image TEXT, after_image TEXT, duration TEXT, featured INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'published', created_at TEXT NOT NULL, updated_at TEXT)",
    "CREATE TABLE IF NOT EXISTS service_items (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, title_en TEXT NOT NULL, title_ar TEXT NOT NULL, description_ar TEXT NOT NULL, description_en TEXT NOT NULL, whatsapp_message_ar TEXT, whatsapp_message_en TEXT, icon TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, featured INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'published', created_at TEXT NOT NULL, updated_at TEXT)",
    "CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT, service TEXT, message TEXT, preferred_date TEXT, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL, updated_at TEXT)",
    "CREATE TABLE IF NOT EXISTS media_items (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL UNIQUE, alt TEXT, category TEXT NOT NULL DEFAULT 'general', created_at TEXT NOT NULL)",
    "CREATE TABLE IF NOT EXISTS faq_items (id INTEGER PRIMARY KEY AUTOINCREMENT, question_ar TEXT NOT NULL, question_en TEXT NOT NULL, answer_ar TEXT NOT NULL, answer_en TEXT NOT NULL, page TEXT NOT NULL DEFAULT 'services', sort_order INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'published', created_at TEXT NOT NULL, updated_at TEXT)",
    "CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'assistant', permissions TEXT NOT NULL DEFAULT '[]', status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT)",
    "CREATE TABLE IF NOT EXISTS activity_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT NOT NULL DEFAULT 'admin', action TEXT NOT NULL, entity TEXT NOT NULL, entity_id TEXT, details TEXT, created_at TEXT NOT NULL)",
    "CREATE TABLE IF NOT EXISTS stats (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL UNIQUE, value INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL)",
    "CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL, updated_at TEXT NOT NULL)",
    "CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status)",
    "CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)",
    "CREATE INDEX IF NOT EXISTS idx_articles_title ON articles(title)",
    "CREATE INDEX IF NOT EXISTS idx_gallery_status ON gallery_items(status)",
    "CREATE INDEX IF NOT EXISTS idx_services_status ON service_items(status)",
    "CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)",
    "CREATE INDEX IF NOT EXISTS idx_media_category ON media_items(category)",
    "CREATE INDEX IF NOT EXISTS idx_faq_page ON faq_items(page)",
    "CREATE INDEX IF NOT EXISTS idx_admin_users_status ON admin_users(status)",
  ];

  for (const statement of schemaStatements) {
    await db.prepare(statement).run();
  }

  await safeSchemaUpgrade(db);

  const reviewCount = await db.prepare("SELECT COUNT(*) as count FROM reviews").first<{ count: number }>();
  if (!reviewCount?.count) {
    await db.batch(
      defaultReviews.map((item) =>
        db.prepare(
          "INSERT INTO reviews (name, rating, message, status, created_at) VALUES (?, ?, ?, ?, ?)"
        ).bind(item[0], item[1], item[2], item[3], new Date().toISOString())
      )
    );
  }

  const articleCount = await db.prepare("SELECT COUNT(*) as count FROM articles").first<{ count: number }>();
  if (!articleCount?.count) {
    await db.batch(
      defaultArticles.map((item) =>
        db.prepare(
          "INSERT INTO articles (title, slug, meta_description, body, conclusion, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(item[0], slugifyArticleTitle(String(item[0])), String(item[1]).slice(0, 160), item[1], item[2], "published", new Date().toISOString(), new Date().toISOString())
      )
    );
  }
  await seedSeoQuestionArticles(db);

  const galleryCount = await db.prepare("SELECT COUNT(*) as count FROM gallery_items").first<{ count: number }>();
  if (!galleryCount?.count) {
    await db.batch(
      defaultGallery.map((item) =>
        db.prepare(
          "INSERT INTO gallery_items (title, category, image, before_image, after_image, duration, featured, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(item[0], item[1], item[2], item[2], item[2], "حسب الحالة", 0, "published", new Date().toISOString(), new Date().toISOString())
      )
    );
  }

  const serviceCount = await db.prepare("SELECT COUNT(*) as count FROM service_items").first<{ count: number }>();
  if (!serviceCount?.count) {
    const now = new Date().toISOString();
    await db.batch(
      defaultServiceItems.map((item) =>
        db.prepare(
          "INSERT INTO service_items (slug, title_en, title_ar, description_ar, description_en, icon, sort_order, featured, status, created_at, updated_at, whatsapp_message_ar, whatsapp_message_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(item[0], item[1], item[2], item[3], item[4], item[5], item[6], 1, "published", now, now, item[7], item[8])
      )
    );
  }

  await seedDefaultFaqItems(db);
  await seedDefaultSettings(db);

  return db;
}

async function safeSchemaUpgrade(db: AppDb) {
  const migrations = [
    "ALTER TABLE articles ADD COLUMN cover_image TEXT",
    "ALTER TABLE articles ADD COLUMN slug TEXT",
    "ALTER TABLE articles ADD COLUMN meta_description TEXT",
    "ALTER TABLE articles ADD COLUMN updated_at TEXT",
    "ALTER TABLE articles ADD COLUMN publish_at TEXT",
    "ALTER TABLE reviews ADD COLUMN updated_at TEXT",
    "ALTER TABLE gallery_items ADD COLUMN before_image TEXT",
    "ALTER TABLE gallery_items ADD COLUMN after_image TEXT",
    "ALTER TABLE gallery_items ADD COLUMN duration TEXT",
    "ALTER TABLE gallery_items ADD COLUMN featured INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE gallery_items ADD COLUMN updated_at TEXT",
    "ALTER TABLE gallery_items ADD COLUMN publish_at TEXT",
    "ALTER TABLE service_items ADD COLUMN whatsapp_message_ar TEXT",
    "ALTER TABLE service_items ADD COLUMN whatsapp_message_en TEXT",
  ];

  for (const statement of migrations) {
    try {
      await db.prepare(statement).run();
    } catch {
      // D1/SQLite throws when a column already exists. Existing deployments can continue safely.
    }
  }

  await db.prepare("INSERT OR IGNORE INTO stats (key, value, updated_at) VALUES (?, ?, ?)")
    .bind("total_visitors", 0, new Date().toISOString())
    .run();

  await backfillArticleSeo(db);
  try {
    await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug_unique ON articles(slug)").run();
  } catch {
    // Existing deployments can continue; duplicate legacy slugs are normalized during backfill.
  }
}

async function seedDefaultSettings(db: AppDb) {
  const now = new Date().toISOString();
  for (const [key, value] of Object.entries(defaultSettings)) {
    await db.prepare("INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES (?, ?, ?)")
      .bind(key, value, now)
      .run();
  }
}

async function seedSeoQuestionArticles(db: AppDb) {
  const now = new Date().toISOString();
  for (const item of defaultArticles) {
    const slug = slugifyArticleTitle(String(item[0]));
    const existing = await db.prepare("SELECT id FROM articles WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first<{ id: number }>();
    if (existing) continue;

    await db.prepare(
      "INSERT INTO articles (title, slug, meta_description, body, conclusion, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(item[0], slug, String(item[1]).slice(0, 160), item[1], item[2], "published", now, now)
      .run();
  }
}

async function seedDefaultFaqItems(db: AppDb) {
  const now = new Date().toISOString();
  for (const item of defaultFaqItems) {
    const existing = await db.prepare("SELECT id FROM faq_items WHERE page = ? AND question_ar = ? LIMIT 1")
      .bind(item[4], item[0])
      .first<{ id: number }>();
    if (existing) continue;

    await db.prepare(
      "INSERT INTO faq_items (question_ar, question_en, answer_ar, answer_en, page, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(item[0], item[1], item[2], item[3], item[4], item[5], "published", now, now)
      .run();
  }
}

async function backfillArticleSeo(db: AppDb) {
  const rows = await db.prepare("SELECT id, title, body, slug, meta_description FROM articles ORDER BY id ASC")
    .all<{ id: number; title: string; body?: string | null; slug?: string | null; meta_description?: string | null }>();

  for (const row of rows.results || []) {
    const needsSlug = !row.slug;
    const needsMeta = !row.meta_description;
    if (!needsSlug && !needsMeta) continue;

    const slug = needsSlug ? await uniqueArticleSlug(db, row.title || defaultSlugFallback, row.id) : row.slug;
    const metaDescription = needsMeta ? String(row.body || row.title || "").trim().slice(0, 160) : row.meta_description;

    await db.prepare("UPDATE articles SET slug = ?, meta_description = ?, updated_at = COALESCE(updated_at, ?) WHERE id = ?")
      .bind(slug, metaDescription, new Date().toISOString(), row.id)
      .run();
  }
}

export function normalizeReview(payload: ReviewPayload) {
  const status = String(payload.status || "pending");
  return {
    name: String(payload.name || "").trim().slice(0, 80),
    rating: Math.min(5, Math.max(1, Number(payload.rating || 5))),
    message: String(payload.message || "").trim().slice(0, 700),
    status: ["pending", "approved", "published", "rejected"].includes(status) ? status : "pending",
  };
}

export function normalizeArticle(payload: ArticlePayload) {
  const rawMeta = payload.metaDescription ?? payload.meta_description ?? "";
  return {
    title: String(payload.title || "").trim().slice(0, 140),
    slug: slugifyArticleTitle(String(payload.slug || payload.title || "")),
    metaDescription: String(rawMeta).trim().slice(0, 160),
    coverImage: String(payload.coverImage || payload.cover_image || "").trim().slice(0, 500),
    body: String(payload.body || "").trim().slice(0, 20000),
    conclusion: String(payload.conclusion || "").trim().slice(0, 2000),
    publishAt: String(payload.publishAt || payload.publish_at || "").trim().slice(0, 50),
    status: payload.status === "draft" ? "draft" : "published",
  };
}

export function pageParams(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(25, Math.max(5, Number(url.searchParams.get("pageSize") || 8)));
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export function likeQuery(value: string | null) {
  return `%${String(value || "").trim().replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
}

export function normalizeGallery(payload: GalleryPayload) {
  const beforeImage = payload.beforeImage || payload.before_image || payload.image || "";
  const afterImage = payload.afterImage || payload.after_image || beforeImage;

  return {
    title: String(payload.title || "").trim().slice(0, 120),
    category: String(payload.category || "Dental Care").trim().slice(0, 80),
    image: String(payload.image || afterImage || beforeImage || "").trim().slice(0, 500),
    beforeImage: String(beforeImage || "").trim().slice(0, 500),
    afterImage: String(afterImage || "").trim().slice(0, 500),
    duration: String(payload.duration || "حسب الحالة").trim().slice(0, 80),
    featured: payload.featuredRaw === 1 || Boolean(payload.featured) ? 1 : 0,
    publishAt: String(payload.publishAt || payload.publish_at || "").trim().slice(0, 50),
    status: payload.status === "draft" ? "draft" : "published",
  };
}

export function normalizeSettings(payload: SettingsPayload) {
  return {
    phonePrimary: String(payload.phonePrimary || defaultSettings.phonePrimary).trim().slice(0, 40),
    phoneSecondary: String(payload.phoneSecondary || defaultSettings.phoneSecondary).trim().slice(0, 40),
    whatsappPhone: String(payload.whatsappPhone || defaultSettings.whatsappPhone).replace(/[^\d]/g, "").slice(0, 20),
    facebookUrl: String(payload.facebookUrl || defaultSettings.facebookUrl).trim().slice(0, 300),
    instagramUrl: String(payload.instagramUrl || defaultSettings.instagramUrl).trim().slice(0, 300),
    tiktokUrl: String(payload.tiktokUrl || defaultSettings.tiktokUrl).trim().slice(0, 300),
    mapUrl: String(payload.mapUrl || defaultSettings.mapUrl).trim().slice(0, 300),
    email: String(payload.email || defaultSettings.email).trim().slice(0, 120),
    homeConfig: String(payload.homeConfig || defaultSettings.homeConfig).trim().slice(0, 5000),
    siteText: String(payload.siteText || defaultSettings.siteText).trim().slice(0, 20000),
    heroConfig: String(payload.heroConfig || defaultSettings.heroConfig).trim().slice(0, 10000),
    themeConfig: String(payload.themeConfig || defaultSettings.themeConfig).trim().slice(0, 8000),
    layoutConfig: String(payload.layoutConfig || defaultSettings.layoutConfig).trim().slice(0, 8000),
    headerFooterConfig: String(payload.headerFooterConfig || defaultSettings.headerFooterConfig).trim().slice(0, 10000),
    bannerConfig: String(payload.bannerConfig || defaultSettings.bannerConfig).trim().slice(0, 5000),
    formConfig: String(payload.formConfig || defaultSettings.formConfig).trim().slice(0, 5000),
    languageOverrides: String(payload.languageOverrides || defaultSettings.languageOverrides).trim().slice(0, 20000),
    scriptsConfig: String(payload.scriptsConfig || defaultSettings.scriptsConfig).trim().slice(0, 10000),
    builderConfig: String(payload.builderConfig || defaultSettings.builderConfig).trim().slice(0, 30000),
    doctorProfile: String(payload.doctorProfile || defaultSettings.doctorProfile).trim().slice(0, 5000),
    seoPages: String(payload.seoPages || defaultSettings.seoPages).trim().slice(0, 10000),
  };
}

export async function readSettings(db: AppDb) {
  await seedDefaultSettings(db);
  const rows = await db.prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>();
  return {
    ...defaultSettings,
    ...Object.fromEntries((rows.results || []).map((row) => [row.key, row.value])),
  };
}

export function parseJsonSetting<T>(value: unknown, fallback: T): T {
  try {
    if (typeof value !== "string" || !value.trim()) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function normalizeService(payload: ServicePayload) {
  const slug = slugifyArticleTitle(String(payload.slug || payload.titleEn || payload.title_en || ""));
  return {
    slug: slug.slice(0, 100),
    titleEn: String(payload.titleEn || payload.title_en || "").trim().slice(0, 120),
    titleAr: String(payload.titleAr || payload.title_ar || "").trim().slice(0, 120),
    descriptionAr: String(payload.descriptionAr || payload.description_ar || "").trim().slice(0, 400),
    descriptionEn: String(payload.descriptionEn || payload.description_en || "").trim().slice(0, 400),
    whatsappMessageAr: String(payload.whatsappMessageAr || payload.whatsapp_message_ar || "").trim().slice(0, 700),
    whatsappMessageEn: String(payload.whatsappMessageEn || payload.whatsapp_message_en || "").trim().slice(0, 700),
    icon: String(payload.icon || "/icons/implant.png").trim().slice(0, 500),
    sortOrder: Number(payload.sortOrder ?? payload.sort_order ?? 0) || 0,
    featured: payload.featuredRaw === 1 || Boolean(payload.featured) ? 1 : 0,
    status: payload.status === "draft" ? "draft" : "published",
  };
}

export function normalizeBooking(payload: BookingPayload) {
  const status = String(payload.status || "new");
  return {
    name: String(payload.name || "").trim().slice(0, 120),
    phone: String(payload.phone || "").trim().slice(0, 50),
    service: String(payload.service || "").trim().slice(0, 140),
    message: String(payload.message || "").trim().slice(0, 700),
    preferredDate: String(payload.preferredDate || payload.preferred_date || "").trim().slice(0, 50),
    status: ["new", "contacted", "closed"].includes(status) ? status : "new",
  };
}

export function normalizeMedia(payload: MediaPayload) {
  return {
    url: String(payload.url || "").trim().slice(0, 500),
    alt: String(payload.alt || "").trim().slice(0, 180),
    category: String(payload.category || "general").trim().slice(0, 80),
  };
}

export function normalizeFaq(payload: Record<string, unknown>) {
  return {
    questionAr: String(payload.questionAr || payload.question_ar || "").trim().slice(0, 220),
    questionEn: String(payload.questionEn || payload.question_en || "").trim().slice(0, 220),
    answerAr: String(payload.answerAr || payload.answer_ar || "").trim().slice(0, 1000),
    answerEn: String(payload.answerEn || payload.answer_en || "").trim().slice(0, 1000),
    page: String(payload.page || "services").trim().slice(0, 80),
    sortOrder: Number(payload.sortOrder ?? payload.sort_order ?? 0) || 0,
    status: payload.status === "draft" ? "draft" : "published",
  };
}

export function normalizeUser(payload: UserPayload) {
  return {
    username: String(payload.username || "").trim().slice(0, 80),
    password: String(payload.password || "").slice(0, 200),
    role: ["admin", "doctor", "assistant", "editor"].includes(String(payload.role)) ? String(payload.role) : "assistant",
    permissions: JSON.stringify(Array.isArray(payload.permissions) ? payload.permissions.slice(0, 20) : []),
    status: payload.status === "disabled" ? "disabled" : "active",
  };
}

export async function logActivity(db: AppDb, action: string, entity: string, entityId?: string | number, details?: unknown) {
  await db.prepare("INSERT INTO activity_logs (actor, action, entity, entity_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind("admin", action.slice(0, 80), entity.slice(0, 80), entityId ? String(entityId) : "", details ? JSON.stringify(details).slice(0, 1000) : "", new Date().toISOString())
    .run();
}

