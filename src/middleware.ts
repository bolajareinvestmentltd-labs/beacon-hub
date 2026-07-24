import { NextResponse, type NextRequest } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/edge-auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isValidSession = !!sessionSecret && !!session && (await verifyAdminSessionToken(session, sessionSecret));

    if (!isValidSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
