import { NextResponse } from "next/server";
import { persistIncomingArticles } from '@/lib/news-sync';
import { isAuthorizedCronRequest } from '@/lib/cron';
import { sendNewsDigest } from '@/lib/newsletter';
import { sendNewsPush } from '@/lib/push-news';

export const maxDuration = 60;

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const NEWS_FEEDS = [
  { category: 'Global News', query: 'world news Nigeria', fallbackQuery: 'Africa international news' },
  { category: 'Tech & Startups', query: 'technology startups artificial intelligence', fallbackQuery: 'Nigeria technology startup' },
  { category: 'Elections 2027', query: 'Nigeria politics election government', fallbackQuery: 'Nigeria election politics' },
  { category: 'Business & Finance', query: 'Nigeria business finance markets', fallbackQuery: 'Nigeria economy business markets' },
  { category: 'Sports', query: 'Nigeria sports football', fallbackQuery: 'Nigerian sports football' },
  { category: 'Entertainment', query: 'Nigeria entertainment film music', fallbackQuery: 'Nollywood Nigeria entertainment' },
  { category: 'Real Estate', query: 'Nigeria real estate property', fallbackQuery: 'Nigeria housing property' },
  { category: 'Health', query: 'Nigeria health healthcare medicine', fallbackQuery: 'Nigeria hospital health medicine' },
  { category: 'Education', query: 'Nigeria education universities', fallbackQuery: 'Nigeria schools education' },
  { category: 'Science & AI', query: 'science research artificial intelligence', fallbackQuery: 'science technology research Africa' },
  { category: 'Climate & Energy', query: 'Nigeria climate energy environment', fallbackQuery: 'Nigeria power renewable energy' },
  { category: 'Nigeria News', query: 'Nigeria latest news', fallbackQuery: 'Nigeria government news' },
] as const;

type GNewsArticle = {
  title?: unknown;
  description?: unknown;
  content?: unknown;
  image?: unknown;
  url?: unknown;
  author?: unknown;
  source?: { name?: unknown };
  publishedAt?: unknown;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 240);
}

async function fetchNewsFromGNews() {
  if (!GNEWS_API_KEY) {
    throw new Error('GNEWS_API_KEY is required to ingest verified news. Generated stories are not published as news.');
  }

  const collected: ReturnType<typeof normalizeGNewsArticle>[] = [];
  const failures: string[] = [];
  const emptyCategories: string[] = [];

  for (const feed of NEWS_FEEDS) {
    let categoryArticles: ReturnType<typeof normalizeGNewsArticle>[] = [];

    for (const searchTerm of [feed.query, feed.fallbackQuery]) {
      const query = new URLSearchParams({
        q: searchTerm,
        lang: 'en',
        max: '5',
        sortby: 'publishedAt',
        token: GNEWS_API_KEY,
      });

      try {
        const response = await fetch(`https://gnews.io/api/v4/search?${query}`, { method: 'GET' });
        const data = await response.json().catch(() => null) as { articles?: GNewsArticle[]; message?: string } | null;
        if (!response.ok || !Array.isArray(data?.articles)) {
          failures.push(`${feed.category}: ${data?.message || `GNews status ${response.status}`}`);
          continue;
        }

        categoryArticles = data.articles
          .filter((article) => typeof article.url === 'string' && /^https?:\/\//.test(article.url))
          .map((article, index) => normalizeGNewsArticle(article, feed.category, index));
        if (categoryArticles.length) break;
      } catch (error) {
        failures.push(`${feed.category}: ${error instanceof Error ? error.message : 'GNews request failed'}`);
      }
    }

    if (categoryArticles.length) collected.push(...categoryArticles);
    else emptyCategories.push(feed.category);
  }

  if (!collected.length && failures.length) {
    throw new Error(failures.join('; '));
  }

  if (failures.length) {
    console.warn('Some category feeds failed:', failures);
  }

  return { articles: collected, emptyCategories };
}

function normalizeGNewsArticle(article: GNewsArticle, category: string, index: number) {
  const title = String(article.title || `News item ${index + 1}`).trim();
  const description = String(article.description || '').trim();
  const content = String(article.content || description || title).trim();
  const articleUrl = typeof article.url === 'string' ? article.url : '';
  const slugCandidate = articleUrl ? slugify(`${articleUrl}-${title}`) : slugify(title);

  return {
    title,
    category,
    slug: slugCandidate,
    image_url: typeof article.image === 'string' ? article.image : null,
    excerpt: description || content.slice(0, 220),
    content: `${content}\n\nSource: ${category}${articleUrl ? `\nRead more: ${articleUrl}` : ''}`,
    author: typeof article.author === 'string' ? article.author.trim() : category,
    source: typeof article.source?.name === 'string' ? article.source.name.trim() : 'GNews',
    published_at: typeof article.publishedAt === 'string' ? article.publishedAt : new Date().toISOString(),
  };
}

export async function GET(req: Request) {
  const isAuthorized = isAuthorizedCronRequest(req, { allowVercelCron: true });

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { articles, emptyCategories } = await fetchNewsFromGNews();
    if (!articles.length) {
      return NextResponse.json({
        success: false,
        error: 'GNews returned no verified articles for the configured categories.',
        emptyCategories,
      }, { status: 502 });
    }

    const result = await persistIncomingArticles(articles);
    let emailDigest = { sent: 0, failed: 0 };
    let pushNotifications = { sent: 0, failed: 0 };

    if (result.inserted.length > 0) {
      try {
        emailDigest = await sendNewsDigest(result.inserted);
      } catch (error) {
        console.error('News published, but subscriber digest delivery failed:', error);
        emailDigest.failed = 1;
      }

      try {
        pushNotifications = await sendNewsPush(result.inserted);
      } catch (error) {
        console.error('News published, but mobile push delivery failed:', error);
        pushNotifications.failed = 1;
      }
    }

    return NextResponse.json({
      success: true,
      source: 'GNews',
      inserted: result.inserted.length,
      skipped: result.skipped.length,
      emptyCategories,
      emailDigest,
      pushNotifications,
      message: emptyCategories.length
        ? `GNews updated with verified articles; no recent items were found for ${emptyCategories.join(', ')}.`
        : 'GNews updated every configured category with verified articles.',
    });
  } catch (error) {
    console.error("News sync failed:", error);
    const message = error instanceof Error ? error.message : "News sync failed";
    const status = message.includes('rate limit') ? 429 : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}


