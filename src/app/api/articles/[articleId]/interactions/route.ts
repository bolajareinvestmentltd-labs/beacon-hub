import { cookies } from 'next/headers';
import { and, avg, count, desc, eq, isNotNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { articleInteractions, articles } from '@/db/schema';
import { checkAPILimit } from '@/lib/rateLimit';
import { verifyReaderSessionToken } from '@/lib/server-auth';

const InteractionSchema = z.object({
  reaction: z.enum(['like', 'dislike']).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().trim().min(5).max(1200).optional(),
}).refine((value) => value.reaction || value.rating || value.comment, {
  message: 'Choose a reaction, rating, or comment.',
});

async function resolveArticleId(value: string) {
  const articleId = Number(value);
  if (!Number.isSafeInteger(articleId) || articleId < 1) return null;
  const article = await db.select({ id: articles.id }).from(articles).where(eq(articles.id, articleId)).limit(1);
  return article[0]?.id ?? null;
}

async function resolveReaderEmail() {
  const secret = process.env.READER_SESSION_SECRET;
  const token = (await cookies()).get('reader_session')?.value;
  return secret && secret.length >= 32 && token ? verifyReaderSessionToken(token, secret) : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ articleId: string }> }) {
  const { articleId: rawId } = await params;
  const articleId = await resolveArticleId(rawId);
  if (!articleId) return NextResponse.json({ error: 'Article not found.' }, { status: 404 });

  const [likesResult, dislikesResult, ratings, comments, readerEmail] = await Promise.all([
    db.select({ total: count() }).from(articleInteractions).where(and(eq(articleInteractions.articleId, articleId), eq(articleInteractions.reaction, 'like'))),
    db.select({ total: count() }).from(articleInteractions).where(and(eq(articleInteractions.articleId, articleId), eq(articleInteractions.reaction, 'dislike'))),
    db.select({ average: avg(articleInteractions.rating), total: count() })
      .from(articleInteractions)
      .where(and(eq(articleInteractions.articleId, articleId), isNotNull(articleInteractions.rating))),
    db.select({ comment: articleInteractions.comment, rating: articleInteractions.rating, createdAt: articleInteractions.updatedAt })
      .from(articleInteractions)
      .where(and(eq(articleInteractions.articleId, articleId), isNotNull(articleInteractions.comment)))
      .orderBy(desc(articleInteractions.updatedAt))
      .limit(30),
    resolveReaderEmail(),
  ]);

  const readerInteraction = readerEmail
    ? (await db.select({ reaction: articleInteractions.reaction, rating: articleInteractions.rating, comment: articleInteractions.comment })
        .from(articleInteractions)
        .where(and(eq(articleInteractions.articleId, articleId), eq(articleInteractions.email, readerEmail)))
        .limit(1))[0]
    : null;
  const rawAverage = ratings[0]?.average;
  const averageRating = rawAverage === null || rawAverage === undefined ? null : Number(rawAverage);

  return NextResponse.json({
    likes: Number(likesResult[0]?.total || 0),
    dislikes: Number(dislikesResult[0]?.total || 0),
    averageRating: averageRating !== null && Number.isFinite(averageRating) ? averageRating : null,
    ratingCount: Number(ratings[0]?.total || 0),
    readerReaction: readerInteraction?.reaction ?? null,
    readerRating: readerInteraction?.rating ?? null,
    readerComment: readerInteraction?.comment ?? null,
    comments: comments.map((item) => ({
      comment: item.comment,
      rating: item.rating,
      updatedAt: item.createdAt,
    })),
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ articleId: string }> }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await checkAPILimit(ip))) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  const email = await resolveReaderEmail();
  if (!email) return NextResponse.json({ error: 'Verify your email to participate.' }, { status: 401 });

  const { articleId: rawId } = await params;
  const articleId = await resolveArticleId(rawId);
  if (!articleId) return NextResponse.json({ error: 'Article not found.' }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Provide a valid reaction or review.' }, { status: 400 });
  }

  const parsed = InteractionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Review details are invalid.' }, { status: 400 });
  }

  const current = (await db.select().from(articleInteractions)
    .where(and(eq(articleInteractions.articleId, articleId), eq(articleInteractions.email, email)))
    .limit(1))[0];
  const values = {
    reaction: parsed.data.reaction ?? current?.reaction ?? null,
    rating: parsed.data.rating ?? current?.rating ?? null,
    comment: parsed.data.comment ?? current?.comment ?? null,
    updatedAt: new Date(),
  };

  await db.insert(articleInteractions).values({
    articleId,
    email,
    ...values,
    createdAt: current?.createdAt ?? new Date(),
  }).onConflictDoUpdate({
    target: [articleInteractions.articleId, articleInteractions.email],
    set: values,
  });

  return NextResponse.json({ success: true });
}