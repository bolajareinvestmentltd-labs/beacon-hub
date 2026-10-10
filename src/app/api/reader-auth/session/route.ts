import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { checkAPILimit } from '@/lib/rateLimit';
import { createReaderSessionToken, verifyReaderSessionToken } from '@/lib/server-auth';
import { SubscribeSchema } from '@/lib/validation';

export async function GET() {
  const secret = process.env.READER_SESSION_SECRET;
  const token = (await cookies()).get('reader_session')?.value;
  const reader = secret && secret.length >= 32 && token ? verifyReaderSessionToken(token, secret) : null;

  return NextResponse.json(reader ? { authenticated: true, email: reader.email } : { authenticated: false });
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await checkAPILimit(ip))) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  const secret = process.env.READER_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ error: 'Reader participation is temporarily unavailable.' }, { status: 503 });
  }
  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)
  ) {
    return NextResponse.json({ error: 'Reader rate limiting is not configured.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();
  const cookieStore = await cookies();
  const existingToken = cookieStore.get('reader_session')?.value;
  const existingReader = existingToken ? verifyReaderSessionToken(existingToken, secret) : null;
  const maxAge = 60 * 60 * 24 * 30;
  const response = NextResponse.json({ authenticated: true, email, emailVerified: false });
  response.cookies.set('reader_session', createReaderSessionToken(email, maxAge, secret, existingReader?.readerId || randomUUID()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });
  return response;
}