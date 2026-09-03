import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  metaDescription: text("meta_description", { length: 160 }),
  coverImage: text("cover_image"),
  body: text("body").notNull(),
  conclusion: text("conclusion").notNull(),
  status: text("status").notNull().default("published"),
  publishAt: text("publish_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  rating: integer("rating").notNull().default(5),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const stats = sqliteTable("stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: integer("value").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const galleryItems = sqliteTable("gallery_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  beforeImage: text("before_image"),
  afterImage: text("after_image"),
  duration: text("duration"),
  featured: integer("featured").notNull().default(0),
  status: text("status").notNull().default("published"),
  publishAt: text("publish_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const serviceItems = sqliteTable("service_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  whatsappMessageAr: text("whatsapp_message_ar"),
  whatsappMessageEn: text("whatsapp_message_en"),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  featured: integer("featured").notNull().default(1),
  status: text("status").notNull().default("published"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone"),
  service: text("service"),
  message: text("message"),
  preferredDate: text("preferred_date"),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const mediaItems = sqliteTable("media_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull().unique(),
  alt: text("alt"),
  category: text("category").notNull().default("general"),
  createdAt: text("created_at").notNull(),
});

export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actor: text("actor").notNull().default("admin"),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  details: text("details"),
  createdAt: text("created_at").notNull(),
});

export const faqItems = sqliteTable("faq_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionAr: text("question_ar").notNull(),
  questionEn: text("question_en").notNull(),
  answerAr: text("answer_ar").notNull(),
  answerEn: text("answer_en").notNull(),
  page: text("page").notNull().default("services"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("published"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("assistant"),
  permissions: text("permissions").notNull().default("[]"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});
