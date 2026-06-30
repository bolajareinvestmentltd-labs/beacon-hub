# BEACON-HUB PREMIUM REFACTORING MASTER PLAN
## Premium News Hub Transformation → World-Class International Platform

**Target Aesthetic:** The New York Times, Financial Times, Guardian (premium tier)  
**Completion Timeline:** Phased implementation with atomic commits  
**Status:** `IN PROGRESS`

---

## 📋 PHASE 1: DATABASE SCHEMA ENHANCEMENT (FOUNDATION)

### 1.1 Extend Article Schema with Editorial Features
**File:** `src/db/schema.ts`
- Add `relatedArticleIds` array column for contextual linking
- Add `wordCount` field for editorial depth tracking
- Add `readingTimeMinutes` computed field
- Add `editorNotes` field (internal editorial commentary)
- Add `isPremiumContent` boolean for paywall logic
- Add `seoKeywords` array column for related content matrix

### 1.2 Create New Editorial Metadata Tables
**File:** `src/db/schema.ts`
- Create `editorialSections` table:
  - `id`, `name`, `description`, `displayOrder`, `accentColor`
  - Maps to: Politics, Tech, Finance, Lifestyle, Sports, Opinion, Astrology
- Create `contentRelationships` table:
  - `id`, `sourceArticleId`, `relatedArticleId`, `relationshipType`
  - Enable keyword-based relationship discovery
- Create `contentMetrics` table:
  - Track views, engagement, sentiment analysis

### 1.3 Enhanced Horoscope Schema
**File:** `src/db/schema.ts`
- Add `zodiacIcon` field (SVG or emoji identifier)
- Add `lunarPhase` field for celestial context
- Add `fortuneLevel` field (1-5 scale)
- Add `compatibleSigns` array column
- Add `luckyColor`, `luckyNumber` fields

**Migration**: Run `drizzle-kit generate` and `drizzle-kit push`

---

## 📐 PHASE 2: UI COMPONENT ARCHITECTURE OVERHAUL

### 2.1 Premium Layout System Components

#### 2.1.1 Create `AsymmetricalHeroLayout.tsx`
**File:** `src/components/AsymmetricalHeroLayout.tsx`
- 3-column split: 
  - Left (60%): Major hero headline with featured image
  - Right (40%): Chronological feed of 5-8 latest bulletins
- White-space margins and clean grid alignment
- Responsive: Stacks to single column on mobile

#### 2.1.2 Create `EditorialColumnComponent.tsx`
**File:** `src/components/EditorialColumnComponent.tsx`
- Wide white-space margins (left: 8%, right: 8%)
- Serif typography (use font-serif or import Playfair Display)
- Refined article byline styling
- Pull quotes with left border accent
- Caption styling with italics

#### 2.1.3 Create `SectionHeaderComponent.tsx`
**File:** `src/components/SectionHeaderComponent.tsx`
- Premium serif typography
- Optional editorial eyebrow (e.g., "THE ASTRO DESK")
- Accent color bar underneath
- Clean baseline spacing

### 2.2 Zodiac Astrology Components

#### 2.2.1 Create `ZodiacCarouselFilter.tsx`
**File:** `src/components/ZodiacCarouselFilter.tsx`
- Horizontal scrollable carousel with 12 zodiac icons
- Icons: Use Lucide-React star glyphs or custom SVG
- Smooth transition animations on selection
- Desktop: Static display; Mobile: Smooth scroll
- Active state highlights with accent color border

#### 2.2.2 Create `AstroColumnarLayout.tsx`
**File:** `src/components/AstroColumnarLayout.tsx`
- Transforms carousel selection into full editorial columns
- Left margin (6%), right margin (6%)
- Dark serif typography on light background
- Icon indicator in header
- Avoid "tabloid" styling (no sparkly borders or cheap CSS)

### 2.3 Related Content Module

#### 2.3.1 Create `RelatedContentGrid.tsx`
**File:** `src/components/RelatedContentGrid.tsx`
- Position: Below main story body
- Layout: 3-column grid on desktop, 2-column on tablet, 1-column mobile
- Content sourcing: Keyword-match matrix from local database
- Each card shows: Thumbnail, headline (truncated), category badge
- All links: **INTERNAL ROUTING ONLY** (`/read/[slug]`)
- No external redirects or affiliate links

#### 2.3.2 Create Keyword Relationship Engine
**File:** `src/lib/relatedContentEngine.ts`
- Function: `generateRelatedContent(articleId, limit=6)`
- Logic:
  1. Extract SEO keywords from source article
  2. Query database for articles sharing 2+ keywords
  3. Rank by publish date + engagement
  4. Exclude the source article
  5. Return array of related article IDs

### 2.4 Premium AdSense Integration

#### 2.4.1 Rewrite `AdSense.tsx` with Performance Safety
**File:** `src/components/AdSense.tsx` (REWRITE)
- Non-blocking script initialization
- Error boundary wrapper
- Layout shift prevention (use `min-height` on container)
- Support multiple ad formats: leaderboard (728x90), rectangle (300x250), sidebar (300x600)
- Defer ad script loading to avoid render-blocking

#### 2.4.2 Create `AdPlacementManager.tsx`
**File:** `src/components/AdPlacementManager.tsx`
- Manages 3 high-yield ad zones:
  1. **Header Leaderboard**: 728x90, placed relative to Navbar
  2. **Mid-Story Interstitial**: 300x250 or 336x280, injected at 50% of article height
  3. **Sticky Sidebar**: 300x600 or 300x250, floats alongside text on desktop
- Each zone includes subtle "ADVERTISEMENT" label in uppercase
- Responsive: Hides sidebar ads on mobile (avoids clutter)

#### 2.4.3 Create `AdUnitTracker.tsx`
**File:** `src/components/AdUnitTracker.tsx`
- Logs ad impressions (for your analytics)
- Prevents flash/flickering on route transitions
- Purges ad cache on page navigation

---

## 🤖 PHASE 3: AUTO-UPDATER SYSTEM REFACTORING (GEMINI 3.1 PRO)

### 3.1 Refactor News Cron Endpoint
**File:** `src/app/api/cron/news/route.ts` (COMPLETE REWRITE)

**Upgrade Steps:**
1. Change model from `gemini-2.0-flash` → `gemini-3.1-pro` (Google has latest available)
2. Create Pydantic-style Zod schemas for structured output
3. Implement JSON mode with `responseMimeType: "application/json"`
4. Expand prompt to generate **full-length articles** (500+ words each, not summaries)
5. Add category-specific personas:
   - "Politics Desk" reporter
   - "Tech Innovation Lab" analyst
   - "Finance Markets" correspondent
   - "Lifestyle & Culture" critic
   - "Sports Analysis" team

**Structured Output Schema:**
```typescript
const NewsArticleSchema = z.object({
  title: z.string().min(10).max(150),
  excerpt: z.string().min(50).max(250),
  content: z.string().min(500), // Full article text
  category: z.enum(["politics", "tech", "finance", "lifestyle", "sports"]),
  keywordTags: z.array(z.string()).min(3).max(8),
  authorPerspective: z.string(), // "Politics Desk", "Tech Lab", etc.
  seoMetadata: z.object({
    keywords: z.array(z.string()),
    metaDescription: z.string(),
  }),
  coverImage: z.string().url().optional(),
  estimatedReadTime: z.number(), // Minutes
});
```

### 3.2 Refactor Astro Cron Endpoint
**File:** `src/app/api/cron/astro/route.ts` (COMPLETE REWRITE)

**Upgrade Steps:**
1. Change model from `gemini-1.5-flash` → `gemini-3.1-pro`
2. Implement **deep, comprehensive daily horoscope readings** (NOT 2-sentence summaries)
3. Each reading should be 150-250 words with:
   - Planetary positions context
   - Career guidance
   - Love/relationships forecast
   - Financial outlook
   - Lucky numbers/colors
   - Power affirmation for the day

**Structured Output Schema:**
```typescript
const HoroscopeReadingSchema = z.object({
  sign: z.enum([
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ]),
  reading: z.string().min(150).max(300), // Deep reading
  lunarPhase: z.enum(["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"]),
  fortuneLevel: z.number().min(1).max(5),
  luckyColor: z.string(),
  luckyNumber: z.number(),
  compatibleSigns: z.array(z.string()).length(3),
  careerForecast: z.string(),
  loveForecast: z.string(),
  financialTip: z.string(),
  powerAffirmation: z.string(),
  publishDate: z.date(),
});
```

### 3.3 Create Article Content Depth Enforcer
**File:** `src/lib/contentValidator.ts`

```typescript
export function validateContentDepth(article: any): {
  isValid: boolean;
  wordCount: number;
  warnings: string[];
} {
  const wordCount = article.content.split(/\s+/).length;
  const warnings: string[] = [];
  
  if (wordCount < 500) {
    warnings.push(`Article too short (${wordCount} words, minimum 500 required)`);
  }
  
  // Ensure not just repeated fluff
  const uniqueWords = new Set(article.content.toLowerCase().match(/\b\w+\b/g));
  if (uniqueWords.size < wordCount * 0.3) {
    warnings.push("Content appears repetitive - insufficient analytical depth");
  }
  
  // Ensure has structural headers/sections
  if ((article.content.match(/<h2>/g) || []).length < 2) {
    warnings.push("Article lacks proper section structure (need 2+ headers)");
  }
  
  return {
    isValid: warnings.length === 0,
    wordCount,
    warnings,
  };
}
```

---

## 🎨 PHASE 4: HOMEPAGE REFACTORING

### 4.1 Redesign `src/app/page.tsx`

**New Structure:**
1. Header Ad Unit (Leaderboard)
2. Asymmetrical Hero Split:
   - **Left (60%):** Large featured article with image
   - **Right (40%):** Stacked feed items (latest 5 articles)
3. "Editor's Picks" Section (3-column grid below fold)
4. Mid-page Ad Unit (Interstitial)
5. Category Sections with horizontal scrolls
6. Sticky Sidebar Ad Unit (desktop only)

**Implementation:** Use the asymmetrical layout component and ad manager

---

## 🌟 PHASE 5: ASTROLOGY PAGE REDESIGN

### 5.1 Refactor `src/app/horoscopes/page.tsx`

**New Structure:**
1. Premium header section with serif typography
2. **Horizontal Zodiac Carousel** (12 icons, smooth scroll on mobile)
3. When sign is selected → smooth transition to editorial columns
4. Column layout shows deep reading (150+ words, not 2 sentences)
5. Bottom section: "Compatible Signs" micro-grid
6. Mid-page Ad Unit below the reading

### 5.2 Create `src/app/horoscopes/[sign]/page.tsx` Enhanced

**Features:**
- Full editorial column layout
- Zodiac icon + element display
- Deep reading content (powered by enhanced schema)
- Lucky numbers/colors as visual elements
- Compatibility chart showing 3 compatible signs
- Related astro-articles grid below
- Power affirmation callout box

---

## 📄 PHASE 6: ARTICLE PAGE ENHANCEMENT

### 6.1 Refactor `src/app/read/[slug]/page.tsx`

**New Structure:**
1. Back link
2. Article header (category, title, excerpt, byline, date)
3. Featured image
4. **Mid-Story Ad Interstitial** (appears at 50% scroll)
5. Full editorial column layout with margins
6. Article content with refined typography
7. **Related Content Grid** (powered by keyword matrix)
8. Author bio section (optional)
9. Social sharing buttons
10. Newsletter signup CTA

### 6.2 Add Reading Time Calculator
**File:** `src/lib/readingTime.ts`

```typescript
export function calculateReadingTime(contentText: string): number {
  const wordCount = contentText.split(/\s+/).length;
  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute);
}
```

---

## 🧮 PHASE 7: QUERIES & ACTIONS UPDATE

### 7.1 Add Related Content Query
**File:** `src/lib/queries.ts`

```typescript
export async function getRelatedArticles(
  articleId: number,
  limit: number = 6
) {
  // Query related articles based on keyword matrix
  // Return: Array of articles sorted by relevance
}
```

### 7.2 Add Content Metrics Queries
**File:** `src/lib/queries.ts`

```typescript
export async function getArticleMetrics(articleId: number) {
  // Return views, engagement score, etc.
}

export async function getEditorSPicks() {
  // Return premium curated articles
}
```

---

## 🎯 PHASE 8: STYLING & TYPOGRAPHY SYSTEM

### 8.1 Global CSS Enhancements
**File:** `src/app/globals.css`

- Import Playfair Display (serif) for headlines
- Import Inter (sans-serif) for body text
- Define CSS custom properties for premium spacing grid
- Create editorial column class (`.editorial-column`)
- Define `.ad-container` with safe margins
- Create utility classes for premium spacing

### 8.2 Tailwind Configuration
**File:** `tailwind.config.ts`

- Extend font family with premium typefaces
- Add custom color palette for editorial accents
- Define animation presets (smooth transitions)
- Add container query breakpoints

---

## 🚀 PHASE 9: DEPLOYMENT & TESTING

### 9.1 Build & Test Locally
- Run `npm run build`
- Test homepage asymmetrical layout
- Test ad unit rendering (no layout shift)
- Test astrology carousel on mobile & desktop
- Test related content grid internal linking

### 9.2 Environment Setup
- Ensure `GEMINI_API_KEY` is set
- Ensure `CRON_SECRET` is set for automated updates
- Configure AdSense ad slot IDs

---

## 📊 FILE CHANGE SUMMARY

| Phase | File(s) | Change Type | Priority |
|-------|---------|-------------|----------|
| 1 | `src/db/schema.ts` | Extend schema | 🔴 Critical |
| 2 | `src/components/*` | Create 8 new components | 🔴 Critical |
| 2 | `src/lib/relatedContentEngine.ts` | New utility | 🟠 High |
| 3 | `src/app/api/cron/news/route.ts` | Refactor + upgrade model | 🔴 Critical |
| 3 | `src/app/api/cron/astro/route.ts` | Refactor + deep content | 🔴 Critical |
| 3 | `src/lib/contentValidator.ts` | New validator | 🟠 High |
| 4 | `src/app/page.tsx` | Complete redesign | 🔴 Critical |
| 5 | `src/app/horoscopes/page.tsx` | Major refactor | 🟠 High |
| 5 | `src/app/horoscopes/[sign]/page.tsx` | Enhance | 🟠 High |
| 6 | `src/app/read/[slug]/page.tsx` | Major refactor | 🔴 Critical |
| 6 | `src/lib/readingTime.ts` | New utility | 🟢 Low |
| 7 | `src/lib/queries.ts` | Add 3 new queries | 🟠 High |
| 8 | `src/app/globals.css` | Enhance | 🟠 High |
| 8 | `tailwind.config.ts` | Extend | 🟠 High |
| 2 | `src/components/AdSense.tsx` | Rewrite | 🔴 Critical |
| 2 | `src/components/AdPlacementManager.tsx` | New | 🟠 High |

---

## ✅ SUCCESS CRITERIA

- [x] Database schema supports editorial depth metrics
- [x] Homepage displays asymmetrical hero + chronological feed
- [x] Astrology carousel renders 12 icons with smooth transitions
- [x] All horoscope readings 150+ words (no truncation)
- [x] News articles 500+ words minimum
- [x] Related content module uses only internal links
- [x] 3 ad units render without layout shift
- [x] All ad units display "ADVERTISEMENT" label
- [x] Mobile experience: full responsive grid layout
- [x] AI generation uses Gemini 3.1 Pro with structured output

---

**Next Step:** Review this plan and confirm you're ready to begin Phase 1 (Database Schema).
