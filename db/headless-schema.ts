import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const globalSettings = pgTable("global_settings", {
  id: integer("id").primaryKey().default(1),
  logoLight: text("logo_light").notNull().default("/brand/logo-transparent.png"),
  logoDark: text("logo_dark").notNull().default("/brand/logo-transparent.png"),
  contactInfo: jsonb("contact_info").$type<{
    phonePrimary?: string;
    phoneSecondary?: string;
    whatsapp?: string;
    email?: string;
    mapUrl?: string;
    addressAr?: string;
    addressEn?: string;
  }>().notNull().default({}),
  socialLinks: jsonb("social_links").$type<{
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  }>().notNull().default({}),
  brandTheme: jsonb("brand_theme").$type<{
    gold?: string;
    bronze?: string;
    charcoal?: string;
    background?: string;
    darkModeEnabled?: boolean;
    buttonStyle?: "gradient" | "solid" | "outline";
  }>().notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pageSections = pgTable(
  "page_sections",
  {
    id: serial("id").primaryKey(),
    pageSlug: varchar("page_slug", { length: 120 }).notNull(),
    sectionKey: varchar("section_key", { length: 120 }).notNull(),
    type: varchar("type", { length: 80 }).notNull(),
    order: integer("order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    content: jsonb("content").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pageOrderIdx: index("page_sections_page_order_idx").on(table.pageSlug, table.order),
    uniqueSection: uniqueIndex("page_sections_page_key_unique").on(table.pageSlug, table.sectionKey),
  })
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    message: text("message").notNull(),
    rating: integer("rating").notNull().default(5),
    avatar: text("avatar"),
    status: varchar("status", { length: 40 }).notNull().default("pending"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("testimonials_status_idx").on(table.status),
    featuredIdx: index("testimonials_featured_idx").on(table.featured),
  })
);

export const media = pgTable(
  "media",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    fileName: varchar("file_name", { length: 260 }).notNull(),
    mimeType: varchar("mime_type", { length: 120 }).notNull(),
    size: integer("size").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    urlUnique: uniqueIndex("media_url_unique").on(table.url),
  })
);

export type GlobalSettings = typeof globalSettings.$inferSelect;
export type PageSection = typeof pageSections.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type MediaItem = typeof media.$inferSelect;
