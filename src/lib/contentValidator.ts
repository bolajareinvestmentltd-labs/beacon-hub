import { z } from 'zod';

const SAFE_PUBLIC_IMAGE_HOST_PATTERNS = [
  /^images\.unsplash\.com$/,
  /^images\.pexels\.com$/,
  /^images\.ctfassets\.net$/,
  /^res\.cloudinary\.com$/,
  /^upload\.wikimedia\.org$/,
  /^media\.giphy\.com$/,
  /^.*\.gstatic\.com$/,
  /^.*\.googleusercontent\.com$/,
  /^.*\.fastly\.net$/,
  /^.*\.akamaized\.net$/,
  /^.*\.cloudfront\.net$/,
  /^.*\.cdn\.com$/,
  /^.*\.bbc\.co\.uk$/,
  /^.*\.bbc\.com$/,
  /^.*\.cnn\.com$/,
  /^.*\.reuters\.com$/,
  /^.*\.apnews\.com$/,
  /^.*\.theguardian\.com$/,
  /^.*\.nytimes\.com$/,
  /^gazettengr\.com$/,
  /^.*\.gazettengr\.com$/,
  /^theeagleonline\.com\.ng$/,
  /^.*\.theeagleonline\.com\.ng$/,
  /^channelstv\.com$/,
  /^.*\.channelstv\.com$/,
  /^hjtyxwizpakpaxl7\.public\.blob\.vercel-storage\.com$/,
  /^humanglemedia\.com$/,
  /^.*\.humanglemedia\.com$/,
  /^astrobiology\.com$/,
  /^.*\.astrobiology\.com$/,
  /^cdn\.legit\.ng$/,
  /^cdn\.guardian\.ng$/,
  /^d1jcea4y7xhp7l\.cloudfront\.net$/,
  /^punchng\.com$/,
  /^.*\.punchng\.com$/,
  /^cdn\.punchng\.com$/,
  /^.*\.wsj\.com$/,
  /^beacon-hub\.com\.ng$/,
  /^www\.beacon-hub\.com\.ng$/,
];

export function sanitizePublicArticleImage(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^(?:data|blob|javascript|vbscript):/i.test(trimmed)) return null;

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();
    const hostname = parsed.hostname.toLowerCase();

    if (protocol !== 'https:') return null;
    if (['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname) || hostname.endsWith('.local')) {
      return null;
    }

    const pathname = parsed.pathname.toLowerCase();
    if (pathname.endsWith('.svg') || pathname.endsWith('.svgz') || pathname.includes('javascript:')) {
      return null;
    }
    if (/(?:^|[\/_-])(logo|icon|favicon)(?:$|[\/_-])/.test(pathname)) {
      return null;
    }

    const isAllowedHost = SAFE_PUBLIC_IMAGE_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
    if (!isAllowedHost) return null;

    return parsed.toString();
  } catch {
    return null;
  }
}

export function resolveSafeShareImage(value?: string | null, fallback = '/beacon-hub-lockup.png') {
  return sanitizePublicArticleImage(value) || fallback;
}

// ======================================================
// STRUCTURED OUTPUT SCHEMAS FOR GEMINI 3.1 PRO
// ======================================================

// News Article Schema
export const NewsArticleSchema = z.object({
  title: z.string().min(10).max(200).describe('Compelling premium headline'),
  excerpt: z.string().min(50).max(300).describe('2-3 sentence summary'),
  content: z.string().min(500).describe('Full article: 500+ words with headers, analytics, narrative'),
  category: z
    .enum(['politics', 'tech', 'finance', 'lifestyle', 'sports'])
    .describe('Article category'),
  keywordTags: z.array(z.string()).min(3).max(8).describe('SEO keywords for relational linking'),
  authorPerspective: z
    .enum(['Politics Desk', 'Tech Lab', 'Finance Markets', 'Lifestyle & Culture', 'Sports Analysis'])
    .describe('Byline persona'),
  coverImage: z
    .string()
    .url()
    .optional()
    .describe('Unsplash or high-quality image URL'),
  estimatedReadTime: z.number().min(1).max(30).describe('Reading time in minutes'),
  metaDescription: z.string().min(50).max(160).describe('SEO meta description'),
});

// Horoscope Reading Schema
export const HoroscopeReadingSchema = z.object({
  sign: z
    .enum([
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ])
    .describe('Zodiac sign'),
  reading: z.string().min(150).max(4000).describe('Deep reading: 150-400 words with celestial context'),
  lunarPhase: z
    .enum([
      'New Moon',
      'Waxing Crescent',
      'First Quarter',
      'Waxing Gibbous',
      'Full Moon',
      'Waning Gibbous',
      'Last Quarter',
      'Waning Crescent',
    ])
    .describe('Current lunar phase'),
  fortuneLevel: z.number().min(1).max(5).describe('Fortune scale 1-5'),
  luckyColor: z.string().describe('Lucky color name or hex'),
  luckyNumber: z.number().int().describe('Single lucky number'),
  compatibleSigns: z.array(z.string()).length(3).describe('Top 3 compatible signs'),
  careerForecast: z.string().min(50).max(200).describe('Career guidance for the day'),
  loveForecast: z.string().min(50).max(200).describe('Love/relationships forecast'),
  financialTip: z.string().min(50).max(200).describe('Financial guidance'),
  powerAffirmation: z.string().min(20).max(150).describe('Empowering affirmation statement'),
  tarotCard: z.string().min(2).max(100).describe('One tarot card drawn for the day'),
  tarotMessage: z.string().min(50).max(400).describe('A grounded daily tarot reflection'),
});

// Batch News Articles Response
export const NewsArticlesBatchSchema = z.array(NewsArticleSchema);

// Batch Horoscopes Response
export const HoroscopeReadingsBatchSchema = z.array(HoroscopeReadingSchema);

// ======================================================
// VALIDATION UTILITIES
// ======================================================

export function validateNewsArticle(article: unknown): {
  valid: boolean;
  data?: z.infer<typeof NewsArticleSchema>;
  errors?: z.ZodError;
} {
  try {
    const data = NewsArticleSchema.parse(article);
    return { valid: true, data };
  } catch (error) {
    return {
      valid: false,
      errors: error as z.ZodError,
    };
  }
}

export function validateHoroscopeReading(reading: unknown): {
  valid: boolean;
  data?: z.infer<typeof HoroscopeReadingSchema>;
  errors?: z.ZodError;
} {
  try {
    const data = HoroscopeReadingSchema.parse(reading);
    return { valid: true, data };
  } catch (error) {
    return {
      valid: false,
      errors: error as z.ZodError,
    };
  }
}

/**
 * Content Depth Validator
 * Ensures articles meet premium quality standards
 */
export function validateContentDepth(article: {
  content?: string | null;
  keywordTags?: string[] | null;
}): {
  isValid: boolean;
  wordCount: number;
  warnings: string[];
  score: number;
} {
  const warnings: string[] = [];
  let score = 100;

  // Word count check (minimum 500)
  const wordCount = article.content?.split(/\s+/).length || 0;
  if (wordCount < 500) {
    warnings.push(`Article too short (${wordCount} words, minimum 500 required)`);
    score -= 25;
  } else if (wordCount >= 1000) {
    score += 10; // Bonus for comprehensive coverage
  }

  // Uniqueness check
  if (article.content) {
    const words = article.content.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    const uniquenessRatio = uniqueWords.size / words.length;

    if (uniquenessRatio < 0.25) {
      warnings.push('Content appears repetitive - insufficient analytical depth');
      score -= 20;
    }
  }

  // Structure check (headers indicate organization)
  const headerCount = (article.content?.match(/<h2>|## /g) || []).length;
  if (headerCount < 2) {
    warnings.push('Article lacks proper section structure (need 2+ headers)');
    score -= 15;
  } else {
    score += 5; // Bonus for good structure
  }

  // Keyword diversity
  const tagCount = article.keywordTags?.length || 0;
  if (tagCount < 3) {
    warnings.push('Insufficient keyword diversity for relational linking');
    score -= 10;
  }

  return {
    isValid: warnings.length === 0 && score >= 60,
    wordCount,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Reading Time Calculator
 */
export function calculateReadingTime(contentText: string): number {
  const wordCount = contentText.split(/\s+/).length;
  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute);
}
