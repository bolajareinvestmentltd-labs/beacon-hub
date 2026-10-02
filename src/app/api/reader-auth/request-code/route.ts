import { createHmac, randomInt } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { db } from '@/db';
import { readerVerificationCodes } from '@/db/schema';
import { checkAPILimit, checkAuthLimit } from '@/lib/rateLimit';
import { SubscribeSchema } from '@/lib/validation';

const RequestSchema = z.object({ email: SubscribeSchema.shape.email });

function hashCode(email: string, code: string, secret: string) {
  return createHmac('sha256', secret).update(`${email}:${code}`).digest('hex');
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await checkAPILimit(ip))) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  const secret = process.env.READER_SESSION_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  if (!secret || secret.length < 32 || !apiKey) {
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
    return NextResponse.json({ error: 'Provide a valid email address.' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Provide a valid email address.' }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  if (!(await checkAuthLimit(email))) {
    return NextResponse.json({ error: 'Too many sign-in attempts. Try again later.' }, { status: 429 });
  }

  const previousChallenge = (await db.select({ createdAt: readerVerificationCodes.createdAt })
    .from(readerVerificationCodes)
    .where(eq(readerVerificationCodes.email, email))
    .limit(1))[0];
  if (previousChallenge && Date.now() - previousChallenge.createdAt.getTime() < 60_000) {
    return NextResponse.json({ error: 'Wait one minute before requesting another code.' }, { status: 429 });
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await db.insert(readerVerificationCodes).values({
      email,
      codeHash: hashCode(email, code, secret),
      expiresAt,
      attempts: 0,
      createdAt: new Date(),
    }).onConflictDoUpdate({
      target: readerVerificationCodes.email,
      set: { codeHash: hashCode(email, code, secret), expiresAt, attempts: 0, createdAt: new Date() },
    });

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Beacon Hub <support@beacon-hub.com.ng>',
      to: email,
      subject: 'Your Beacon Hub sign-in code',
      text: `Your Beacon Hub verification code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
    });

    if (result.error) {
      await db.delete(readerVerificationCodes).where(eq(readerVerificationCodes.email, email));
      return NextResponse.json({ error: 'We could not send your code. Try again later.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: 'Check your inbox for a sign-in code.' });
  } catch (error) {
    await db.delete(readerVerificationCodes).where(eq(readerVerificationCodes.email, email));
    console.error('Reader verification email failed:', error);
    return NextResponse.json({ error: 'We could not send your code. Try again later.' }, { status: 502 });
  }
}