import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// 1. The Content Hub (News & Dev Logs)
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(), 
  category: text('category').notNull(), 
  coverImage: text('cover_image'),
  content: text('content').notNull(),
  author: text('author').default("Senior Architect"),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. The Astrology Engine
export const horoscopes = pgTable('horoscopes', {
  id: serial('id').primaryKey(),
  sign: text('sign').notNull(), 
  prediction: text('prediction').notNull(),
  luckyColor: text('lucky_color'),
  date: timestamp('date').defaultNow(),
});

// 3. AySmart Deals (Cars & Houses)
export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), 
  title: text('title').notNull(),
  price: integer('price').notNull(),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. The Audience (Resend Magic Links)
export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  isActive: boolean('is_active').default(true),
  joinedAt: timestamp('joined_at').defaultNow(),
});
