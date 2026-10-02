import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyReaderSessionToken } from '@/lib/server-auth';

export async function GET() {
  const secret = process.env.READER_SESSION_SECRET;
  const token = (await cookies()).get('reader_session')?.value;
  const email = secret && secret.length >= 32 && token ? verifyReaderSessionToken(token, secret) : null;

  return NextResponse.json(email ? { authenticated: true, email } : { authenticated: false });
}