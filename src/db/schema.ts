import { pgTable, text, timestamp, boolean, varchar, serial, integer } from "drizzle-orm/pg-core";

// ==========================================
// 1. INTELLIGENCE DESK (News & Editorials)
// ==========================================
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(), 
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull().default(""), 
  
  category: varchar("category", { length: 100 }).notNull(),
  author: varchar("author", { length: 255 }).default("Beacon-Hub Intelligence"),
  source: varchar("source", { length: 255 }),
  coverImage: text("cover_image"), 
  
  isBreaking: boolean("is_breaking").default(false), 
  
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
// 3. ADMIN PORTAL (JCLS / Editors)
// ==========================================
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(), // Hashed for security
  role: varchar("role", { length: 50 }).default("editor"), // e.g., 'superadmin', 'editor'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 4. THE ASTRO DESK (Horoscopes)
// ==========================================
export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  sign: varchar("sign", { length: 50 }).notNull(), // e.g., 'Aries', 'Taurus'
  reading: text("reading").notNull(), // The daily celestial insight
  publishDate: timestamp("publish_date").notNull(), // Which day this reading is for
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 5. SPECIAL DEALS & MARKETPLACE
// ==========================================
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  vendorName: varchar("vendor_name", { length: 255 }).notNull(), // e.g., Realtor, Brand Name
  price: integer("price"), // Stored as a whole number
  
  // Standard locked platform processing logic
  platformFee: integer("platform_fee").default(50), 
  
  category: varchar("category", { length: 100 }), // e.g., 'Real Estate', 'Cosmetics', 'VIP Events'
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});