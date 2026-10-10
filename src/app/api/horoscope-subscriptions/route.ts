import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { checkAPILimit } from '@/lib/rateLimit';

const HoroscopeSubscriptionSchema = z.object({
  email: z.string().email().max(255),
  sign: z.enum(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await checkAPILimit(ip))) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter your email and zodiac sign.' }, { status: 400 });
  }
  const parsed = HoroscopeSubscriptionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email and zodiac sign.' }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();
  try {
    await db.insert(subscribers).values({
      email,
      unsubscribedAt: null,
      newsUpdates: false,
      horoscopeUpdates: true,
      zodiacSign: parsed.data.sign,
    }).onConflictDoUpdate({
      target: subscribers.email,
      set: { unsubscribedAt: null, horoscopeUpdates: true, zodiacSign: parsed.data.sign },
    });
    return NextResponse.json({ success: true, message: `Daily ${parsed.data.sign} and tarot updates are on.` });
  } catch (error) {
    console.error('Horoscope subscription failed:', error);
    return NextResponse.json({ error: 'We could not save your astrology subscription.' }, { status: 500 });
  }
}