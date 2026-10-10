import { type NextRequest, NextResponse } from 'next/server';
import { returnPathOf } from '@/components/shell/screens';
import { apiBaseUrl, isDemoMode } from '@/lib/api-config';
import { REQUESTED_PATH_HEADER } from '@/lib/requested-path';
import { SESSION_COOKIE_NAME } from '@/lib/session-cookie';
import {
  apiOriginFrom,
  buildContentSecurityPolicy,
  CONTENT_SECURITY_POLICY_HEADER,
  createNonce,
} from '@/lib/security-headers';

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

function contentSecurityPolicy(): string {
  return buildContentSecurityPolicy({
    apiOrigin: apiOriginFrom(apiBaseUrl()),
    isDev: process.env.NODE_ENV === 'development',
    nonce: createNonce(),
  });
}

function renderWith(
  request: NextRequest,
  requestHeaders: Readonly<Record<string, string>> = {},
): NextResponse {
  const policy = contentSecurityPolicy();
  const headers = new Headers(request.headers);
  headers.set(CONTENT_SECURITY_POLICY_HEADER, policy);
  for (const [name, value] of Object.entries(requestHeaders)) {
    headers.set(name, value);
  }
  const response = NextResponse.next({ request: { headers } });
  response.headers.set(CONTENT_SECURITY_POLICY_HEADER, policy);
  return response;
}

export function proxy(request: NextRequest) {
  if (isDemoMode()) {
    return renderWith(request);
  }
  const { pathname, search, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  const onSignIn = pathname === SIGN_IN_PATH;

  if (!hasSession && !onSignIn) {
    return NextResponse.redirect(signInUrl(request));
  }
  if (hasSession && onSignIn && !searchParams.has('expired')) {
    const returnPath = returnPathOf(searchParams.get(RETURN_PARAMETER)) ?? '/';
    return NextResponse.redirect(new URL(returnPath, request.url));
  }
  return renderWith(request, { [REQUESTED_PATH_HEADER]: `${pathname}${search}` });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|robots.txt|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)',
  ],
};
