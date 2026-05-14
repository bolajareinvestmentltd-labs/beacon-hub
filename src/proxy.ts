import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session');

  // If the user is trying to access the Command Center...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // ...and they don't have the secure cookie, kick them to the login screen.
    if (!session || session.value !== 'secure_jcls_token_active') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Only run this proxy on the admin routes to keep the rest of the site blazing fast
export const config = {
  matcher: ['/admin/:path*'],
};
