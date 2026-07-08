import { NextResponse } from 'next/server';
import { persistIncomingArticles } from '@/lib/news-sync';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const articles = Array.isArray(payload?.articles)
      ? payload.articles
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload)
          ? payload
          : [];

    if (!articles.length) {
      return NextResponse.json({ error: 'No articles provided' }, { status: 400 });
    }

    const result = await persistIncomingArticles(articles);

    return NextResponse.json({
      success: true,
      inserted: result.inserted.length,
      skipped: result.skipped.length,
      received: articles.length,
    });
  } catch (error) {
    console.error('Admin fetch news failed:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
