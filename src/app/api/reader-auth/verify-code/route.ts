import { createHmac, timingSafeEqual } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { readerVerificationCodes } from '@/db/schema';
import { createReaderSessionToken } from '@/lib/server-auth';
import { checkAPILimit, checkAuthLimit } from '@/lib/rateLimit';
import { SubscribeSchema } from '@/lib/validation';

const VerifySchema = z.object({
  email: SubscribeSchema.shape.email,
  code: z.string().regex(/^\d{6}$/),
});

function hashCode(email: string, code: string, secret: string) {
  return createHmac('sha256', secret).update(`${email}:${code}`).digest('hex');
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await checkAPILimit(ip))) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  const secret = process.env.READER_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ error: 'Email sign-in is temporarily unavailable.' }, { status: 503 });
  }
  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)
  ) {
    return NextResponse.json({ error: 'Email sign-in rate limiting is not configured.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter the email and six-digit code.' }, { status: 400 });
  }

  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter the email and six-digit code.' }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  if (!(await checkAuthLimit(email))) {
    return NextResponse.json({ error: 'Too many sign-in attempts. Try again later.' }, { status: 429 });
  }

  const challenge = (await db
    .select()
    .from(readerVerificationCodes)
    .where(eq(readerVerificationCodes.email, email))
    .limit(1))[0];

  if (!challenge || challenge.expiresAt.getTime() <= Date.now() || challenge.attempts >= 5) {
    if (challenge) await db.delete(readerVerificationCodes).where(eq(readerVerificationCodes.email, email));
    return NextResponse.json({ error: 'That code is invalid or expired. Request a new one.' }, { status: 400 });
  }

  const expected = Buffer.from(challenge.codeHash, 'hex');
  const actual = Buffer.from(hashCode(email, parsed.data.code, secret), 'hex');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    await db.update(readerVerificationCodes)
      .set({ attempts: challenge.attempts + 1 })
      .where(eq(readerVerificationCodes.email, email));
    return NextResponse.json({ error: 'That code is invalid or expired. Request a new one.' }, { status: 400 });
  }

  await db.delete(readerVerificationCodes).where(eq(readerVerificationCodes.email, email));
  const maxAge = 60 * 60 * 24 * 30;
  const response = NextResponse.json({ success: true, email });
  response.cookies.set('reader_session', createReaderSessionToken(email, maxAge, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });
  return response;
}