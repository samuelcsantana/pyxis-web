import { type NextRequest, NextResponse } from 'next/server';
import { returnPathOf } from '@/components/shell/screens';
import { isDemoMode, SESSION_COOKIE_NAME } from '@/lib/api-config';
import { REQUESTED_PATH_HEADER } from '@/lib/requested-path';

export const SIGN_IN_PATH = '/sign-in';
export const RETURN_PARAMETER = 'next';

function signInUrl(request: NextRequest): URL {
  const url = new URL(SIGN_IN_PATH, request.url);
  const { pathname, search } = request.nextUrl;
  const returnPath = returnPathOf(`${pathname}${search}`);
  if (returnPath !== undefined) {
    url.searchParams.set(RETURN_PARAMETER, returnPath);
  }
  return url;
}

function withRequestedPath(request: NextRequest): NextResponse {
  const headers = new Headers(request.headers);
  const { pathname, search } = request.nextUrl;
  headers.set(REQUESTED_PATH_HEADER, `${pathname}${search}`);
  return NextResponse.next({ request: { headers } });
}

export function proxy(request: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.next();
  }
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  const onSignIn = pathname === SIGN_IN_PATH;

  if (!hasSession && !onSignIn) {
    return NextResponse.redirect(signInUrl(request));
  }
  if (hasSession && onSignIn && !searchParams.has('expired')) {
    const returnPath = returnPathOf(searchParams.get(RETURN_PARAMETER)) ?? '/';
    return NextResponse.redirect(new URL(returnPath, request.url));
  }
  return withRequestedPath(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|robots.txt|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)',
  ],
};
