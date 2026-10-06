import { type NextRequest, NextResponse } from 'next/server';
import { isDemoMode, SESSION_COOKIE_NAME } from '@/lib/api-config';

export const SIGN_IN_PATH = '/sign-in';

export function proxy(request: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.next();
  }
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  const onSignIn = pathname === SIGN_IN_PATH;

  if (!hasSession && !onSignIn) {
    return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
  }
  if (hasSession && onSignIn && !searchParams.has('expired')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|robots.txt|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)',
  ],
};
