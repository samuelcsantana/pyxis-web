import { type NextRequest, NextResponse } from 'next/server';
import { returnPathOf } from '@/components/shell/screens';
import { PATH_LOCALE_HEADER } from '@/i18n/path-locale';
import { apiBaseUrl, isDemoMode } from '@/lib/api-config';
import {
  internalPathOf,
  isInternalLandingPath,
  landingPageAt,
  landingPageOfInternalPath,
  landingUrlOf,
} from '@/lib/landing-pages';
import { REQUESTED_PATH_HEADER } from '@/lib/requested-path';
import { SESSION_COOKIE_NAME } from '@/lib/session-cookie';
import {
  apiOriginFrom,
  buildContentSecurityPolicy,
  CONTENT_SECURITY_POLICY_HEADER,
  createNonce,
} from '@/lib/security-headers';
import { LANDING_HOST, LIVE_DEMO_URL } from '@/lib/site';

export const SIGN_IN_PATH = '/sign-in';
export const RETURN_PARAMETER = 'next';

const PERMANENT_REDIRECT = 308;

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

function forwardedHeaders(
  request: NextRequest,
  policy: string,
  requestHeaders: Readonly<Record<string, string>>,
): Headers {
  const headers = new Headers(request.headers);
  headers.delete(PATH_LOCALE_HEADER);
  headers.set(CONTENT_SECURITY_POLICY_HEADER, policy);
  for (const [name, value] of Object.entries(requestHeaders)) {
    headers.set(name, value);
  }
  return headers;
}

function renderWith(
  request: NextRequest,
  requestHeaders: Readonly<Record<string, string>> = {},
  rewriteTo?: URL,
): NextResponse {
  const policy = contentSecurityPolicy();
  const init = { request: { headers: forwardedHeaders(request, policy, requestHeaders) } };
  const response =
    rewriteTo === undefined ? NextResponse.next(init) : NextResponse.rewrite(rewriteTo, init);
  response.headers.set(CONTENT_SECURITY_POLICY_HEADER, policy);
  return response;
}

function landingOrDemo(request: NextRequest): NextResponse {
  const { hostname, pathname, search } = request.nextUrl;
  if (isInternalLandingPath(pathname)) {
    return NextResponse.redirect(
      landingUrlOf(landingPageOfInternalPath(pathname)),
      PERMANENT_REDIRECT,
    );
  }
  if (hostname !== LANDING_HOST) {
    return renderWith(request);
  }
  const page = landingPageAt(pathname);
  if (page === undefined) {
    return NextResponse.redirect(
      new URL(`${pathname}${search}`, LIVE_DEMO_URL),
      PERMANENT_REDIRECT,
    );
  }
  const internal = new URL(internalPathOf(page), request.url);
  internal.search = search;
  return renderWith(request, { [PATH_LOCALE_HEADER]: page.locale }, internal);
}

export function proxy(request: NextRequest) {
  if (isDemoMode()) {
    return landingOrDemo(request);
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
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)',
  ],
};
