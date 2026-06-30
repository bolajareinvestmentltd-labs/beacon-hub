<<<<<<< HEAD
﻿import { pgTable, text, timestamp, boolean, varchar, serial, integer, json, smallint } from "drizzle-orm/pg-core";

// ==========================================
// 1. INTELLIGENCE DESK (News & Editorials) - ENHANCED
// ==========================================
=======
import { pgTable, serial, varchar, text, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";

>>>>>>> 73f3f1d2fbbee024e1f7160accdfdd2e8eae7d6c
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
<<<<<<< HEAD
  author: varchar("author", { length: 255 }).default("Beacon-Hub Intelligence"),
  source: varchar("source", { length: 255 }),
  coverImage: text("cover_image"), 
  
  isBreaking: boolean("is_breaking").default(false), 
  isSponsored: boolean("is_sponsored").default(false),
  
  // ✨ NEW PREMIUM EDITORIAL FIELDS
  wordCount: integer("word_count").default(0),
  readingTimeMinutes: integer("reading_time_minutes").default(0),
  editorNotes: text("editor_notes").default(""),
  isPremiumContent: boolean("is_premium_content").default(false),
  seoKeywords: json("seo_keywords").default([]), // Array of keywords
  relatedArticleIds: json("related_article_ids").default([]), // Array of IDs
  authorPerspective: varchar("author_perspective", { length: 255 }).default("Editorial Board"),
  metaDescription: text("meta_description").default(""),
  
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 2. THE NETWORK (Subscribers)
// ==========================================
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(), 
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 3. ADMIN PORTAL (JCLs / Editors)
// ==========================================
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(), // Hashed for security
  role: varchar("role", { length: 50 }).default("editor"), // e.g., 'superadmin', 'editor'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 4. THE ASTRO DESK (Horoscopes) - ENHANCED
// ==========================================
export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  sign: varchar("sign", { length: 50 }).notNull(), // e.g., 'Aries', 'Taurus'
  reading: text("reading").notNull(), // Deep celestial insight (150+ words)
  
  // ✨ NEW PREMIUM ASTRO FIELDS
  lunarPhase: varchar("lunar_phase", { length: 50 }).default(""), // e.g., 'Full Moon'
  fortuneLevel: smallint("fortune_level").default(3), // 1-5 scale
  luckyColor: varchar("lucky_color", { length: 50 }).default(""),
  luckyNumber: integer("lucky_number").default(0),
  compatibleSigns: json("compatible_signs").default([]), // Array of 3 signs
  careerForecast: text("career_forecast").default(""),
  loveForecast: text("love_forecast").default(""),
  financialTip: text("financial_tip").default(""),
  powerAffirmation: text("power_affirmation").default(""),
  zodiacIcon: varchar("zodiac_icon", { length: 255 }).default(""), // SVG or emoji ID
  
  publishDate: timestamp("publish_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 4a. EDITORIAL SECTIONS (Premium Categories)
// ==========================================
export const editorialSections = pgTable("editorial_sections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description").default(""),
  displayOrder: integer("display_order").default(0),
  accentColor: varchar("accent_color", { length: 7 }).default("#E2725B"), // Hex color
  icon: varchar("icon", { length: 255 }).default(""), // Lucide icon name or SVG ID
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 4b. CONTENT RELATIONSHIPS (Keyword-based linking)
// ==========================================
export const contentRelationships = pgTable("content_relationships", {
  id: serial("id").primaryKey(),
  sourceArticleId: integer("source_article_id").notNull(),
  relatedArticleId: integer("related_article_id").notNull(),
  relationshipType: varchar("relationship_type", { length: 50 }).default("keyword_match"), // 'keyword_match', 'manual', 'topic'
  relevanceScore: integer("relevance_score").default(0), // 0-100 score
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 4c. CONTENT METRICS (Engagement tracking)
// ==========================================
export const contentMetrics = pgTable("content_metrics", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull(),
  views: integer("views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  engagementScore: integer("engagement_score").default(0), // Composite metric
  avgReadDuration: integer("avg_read_duration").default(0), // Seconds
  bounceRate: integer("bounce_rate").default(0), // Percentage
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 5. SPECIAL DEALS & MARKETPLACE
// ==========================================
=======
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").default(true),
  isBreaking: boolean("is_breaking").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

>>>>>>> 73f3f1d2fbbee024e1f7160accdfdd2e8eae7d6c
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  price: integer("price").notNull(),
  vendorName: varchar("vendor_name", { length: 255 }).notNull(),
  platformFee: integer("platform_fee").default(50).notNull(),
  imageUrl: text("image_url"),
<<<<<<< HEAD
  videoUrl: text("video_url"), 
  hasWatermark: boolean("has_watermark").default(false),
  isActive: boolean("is_active").default(true),
  
=======
  videoUrl: text("video_url"),
  hasWatermark: boolean("has_watermark").default(false),
  isActive: boolean("is_active").default(true).notNull(),
>>>>>>> 73f3f1d2fbbee024e1f7160accdfdd2e8eae7d6c
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
