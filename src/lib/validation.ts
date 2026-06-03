import { z } from 'zod';

// Article validation
export const ArticleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be at most 200 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(50000, 'Content too long'),
  category: z.enum(['Technology', 'Business', 'Science', 'Health', 'Entertainment', 'Politics', 'Sports', 'World'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  author: z.string().min(2, 'Author name too short').max(100, 'Author name too long'),
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  coverImage: z.string().url('Invalid image URL').optional(),
});

// Login validation
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password too long'),
});

// Contact form validation
export const ContactSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject too short').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message too short').max(5000, 'Message too long'),
  category: z.enum(['Support', 'Partnership', 'Bug Report', 'Feature Request', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
});

// Deal validation
export const DealSchema = z.object({
  title: z.string().min(3, 'Title too short').max(200, 'Title too long'),
  description: z.string().min(10, 'Description too short').max(5000, 'Description too long'),
  vendorName: z.string().min(2, 'Vendor name too short').max(100, 'Vendor name too long'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(2, 'Category too short').max(100, 'Category too long'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  videoUrl: z.string().url('Invalid video URL').optional(),
  hasWatermark: z.boolean().default(false),
});

// Newsletter subscription
export const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Horoscope validation
export const HoroscopeSchema = z.object({
  sign: z.enum(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']),
  reading: z.string().min(50, 'Reading too short').max(2000, 'Reading too long'),
});

export type Article = z.infer<typeof ArticleSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Deal = z.infer<typeof DealSchema>;
export type Subscribe = z.infer<typeof SubscribeSchema>;
export type Horoscope = z.infer<typeof HoroscopeSchema>;
