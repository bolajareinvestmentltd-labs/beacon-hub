import { pgTable, serial, varchar, text, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").default(true),
  isBreaking: boolean("is_breaking").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  price: integer("price").notNull(),
  vendorName: varchar("vendor_name", { length: 255 }).notNull(),
  platformFee: integer("platform_fee").default(50).notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  hasWatermark: boolean("has_watermark").default(false),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const astrology = pgTable("astrology", {
  id: serial("id").primaryKey(),
  sign: varchar("sign", { length: 20 }).notNull(),
  date: date("date").notNull(),
  focusToken: varchar("focus_token", { length: 50 }).notNull(),
  reading: text("reading").notNull(),
  metricFocus: integer("metric_focus").notNull(),
  metricRisk: integer("metric_risk").notNull(),
  metricVelocity: integer("metric_velocity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export { astrology as horoscopes };
