import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").default(true),
  isBreaking: boolean("is_breaking").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  vendorName: text("vendor_name").notNull(),
  platformFee: integer("platform_fee").default(50),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  hasWatermark: boolean("has_watermark").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  sign: text("sign").notNull(),
  reading: text("reading").notNull(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
