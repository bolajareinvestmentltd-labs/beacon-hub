import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
  serial,
  integer,
  json,
  smallint,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ==========================================
// 1. INTELLIGENCE DESK (News & Editorials) - ENHANCED
// ==========================================
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),

  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),

  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),

  category: varchar('category', { length: 100 }).notNull(),

  author: varchar('author', { length: 255 }).default('Beacon-Hub Intelligence'),
  source: varchar('source', { length: 255 }),
  coverImage: text('cover_image'),

  isBreaking: boolean('is_breaking').default(false),
  isSponsored: boolean('is_sponsored').default(false),

  // ✨ NEW PREMIUM EDITORIAL FIELDS
  wordCount: integer('word_count').default(0),
  readingTimeMinutes: integer('reading_time_minutes').default(0),
  editorNotes: text('editor_notes').default(''),

  isPremiumContent: boolean('is_premium_content').default(false),
  seoKeywords: json('seo_keywords').default([]), // Array of keywords
  relatedArticleIds: json('related_article_ids').default([]), // Array of IDs
  authorPerspective: varchar('author_perspective', { length: 255 }).default('Editorial Board'),
  metaDescription: text('meta_description').default(''),

  publishedAt: timestamp('published_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 2. THE NETWORK (Subscribers)
// ==========================================
export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 3. ADMIN PORTAL (JCLs / Editors)
// ==========================================
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('editor'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4. THE ASTRO DESK (Horoscopes) - ENHANCED
// ==========================================
export const horoscopes = pgTable('horoscopes', {
  id: serial('id').primaryKey(),
  sign: varchar('sign', { length: 50 }).notNull(),

  reading: text('reading').notNull(),

  // ✨ NEW PREMIUM ASTRO FIELDS
  lunarPhase: varchar('lunar_phase', { length: 50 }).default(''),
  fortuneLevel: smallint('fortune_level').default(3),
  luckyColor: varchar('lucky_color', { length: 50 }).default(''),
  luckyNumber: integer('lucky_number').default(0),
  compatibleSigns: json('compatible_signs').default([]),

  careerForecast: text('career_forecast').default(''),
  loveForecast: text('love_forecast').default(''),
  financialTip: text('financial_tip').default(''),
  powerAffirmation: text('power_affirmation').default(''),
  zodiacIcon: varchar('zodiac_icon', { length: 255 }).default(''),

  // NOTE: schema conflict existed; we keep the field name used by earlier side
  publishDate: timestamp('publish_date').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4a. EDITORIAL SECTIONS (Premium Categories)
// ==========================================
export const editorialSections = pgTable('editorial_sections', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description').default(''),
  displayOrder: integer('display_order').default(0),
  accentColor: varchar('accent_color', { length: 7 }).default('#E2725B'),
  icon: varchar('icon', { length: 255 }).default(''),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4b. CONTENT RELATIONSHIPS (Keyword-based linking)
// ==========================================
export const contentRelationships = pgTable('content_relationships', {
  id: serial('id').primaryKey(),
  sourceArticleId: integer('source_article_id').notNull(),
  relatedArticleId: integer('related_article_id').notNull(),
  relationshipType: varchar('relationship_type', { length: 50 }).default('keyword_match'),
  relevanceScore: integer('relevance_score').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4c. CONTENT METRICS (Engagement tracking)
// ==========================================
export const contentMetrics = pgTable('content_metrics', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').notNull(),

  views: integer('views').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
  engagementScore: integer('engagement_score').default(0),
  avgReadDuration: integer('avg_read_duration').default(0),
  bounceRate: integer('bounce_rate').default(0),

  lastUpdated: timestamp('last_updated').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4d. SITE TRAFFIC (Anonymous daily check-ins)
// ==========================================
export const siteTraffic = pgTable('site_traffic', {
  id: serial('id').primaryKey(),
  visitorId: varchar('visitor_id', { length: 64 }).notNull(),
  visitDate: date('visit_date').notNull(),
  visits: integer('visits').default(1).notNull(),
  firstPath: text('first_path'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  visitorDateIndex: uniqueIndex('site_traffic_visitor_date_idx').on(table.visitorId, table.visitDate),
}));

// ==========================================
// 5. SPECIAL DEALS & MARKETPLACE
// ==========================================
export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  price: integer('price').notNull(),
  vendorName: varchar('vendor_name', { length: 255 }).notNull(),
  platformFee: integer('platform_fee').default(50).notNull(),
  imageUrl: text('image_url'),

  videoUrl: text('video_url'),
  hasWatermark: boolean('has_watermark').default(false),
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});



