import { type NextRequest, NextResponse } from 'next/server';
import { returnPathOf } from '@/components/shell/screens';
import { LOCALE_COOKIE_NAME } from '@/i18n/locales';
import { PATH_LOCALE_HEADER } from '@/i18n/path-locale';
import { apiBaseUrl, isDemoMode } from '@/lib/api-config';
import { requestHostname } from '@/lib/host-name';
import { landingIngestionUrl } from '@/lib/landing-measurement-config';
import { legalConfig } from '@/lib/legal-config';
import {
  CONTRACT_LANGUAGE,
  internalLegalPathOf,
  legalDocumentAt,
  legalDocumentOfInternalPath,
  legalUrlOf,
} from '@/lib/legal-documents';
import { carriesPreferences, preferencesIn, withoutPreferences } from '@/lib/link-preferences';
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
import { THEME_COOKIE_NAME } from '@/lib/theme';

export const SIGN_IN_PATH = '/sign-in';
export const SIGN_UP_PATH = '/sign-up';
export const RETURN_PARAMETER = 'next';

const PERMANENT_REDIRECT = 308;
const TEMPORARY_REDIRECT = 307;
const ONE_YEAR_IN_SECONDS = 31_536_000;

function rememberLinkPreferences(request: NextRequest): NextResponse | undefined {
  const { searchParams } = request.nextUrl;
  if (!carriesPreferences(searchParams)) {
    return undefined;
  }
  const { locale, theme } = preferencesIn(searchParams);
  const response = NextResponse.redirect(
    withoutPreferences(new URL(request.url)),
    TEMPORARY_REDIRECT,
  );
  const lasting = { path: '/', maxAge: ONE_YEAR_IN_SECONDS, sameSite: 'lax' } as const;
  if (locale !== undefined) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, { ...lasting, httpOnly: true });
  }
  if (theme !== undefined) {
    response.cookies.set(THEME_COOKIE_NAME, theme, lasting);
  }
  return response;
}

function signInUrl(request: NextRequest): URL {
  const url = new URL(SIGN_IN_PATH, request.url);
  const { pathname, search } = request.nextUrl;
  const returnPath = returnPathOf(`${pathname}${search}`);
  if (returnPath !== undefined) {
    url.searchParams.set(RETURN_PARAMETER, returnPath);
  }
  return url;
}

function contentSecurityPolicy(apiOrigin: string | undefined): string {
  return buildContentSecurityPolicy({
    apiOrigin,
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

interface Rewrite {
  readonly to: URL;
  readonly apiOrigin: string | undefined;
}

function renderWith(
  request: NextRequest,
  requestHeaders: Readonly<Record<string, string>> = {},
  rewrite?: Rewrite,
): NextResponse {
  const policy = contentSecurityPolicy(rewrite?.apiOrigin ?? apiOriginFrom(apiBaseUrl()));
  const init = { request: { headers: forwardedHeaders(request, policy, requestHeaders) } };
  const response =
    rewrite === undefined ? NextResponse.next(init) : NextResponse.rewrite(rewrite.to, init);
  response.headers.set(CONTENT_SECURITY_POLICY_HEADER, policy);
  return response;
}

function landingOrDemo(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;
  if (isInternalLandingPath(pathname)) {
    return NextResponse.redirect(
      landingUrlOf(landingPageOfInternalPath(pathname)),
      PERMANENT_REDIRECT,
    );
  }
  const internalLegal = legalDocumentOfInternalPath(pathname);
  if (internalLegal !== undefined) {
    return NextResponse.redirect(legalUrlOf(internalLegal), PERMANENT_REDIRECT);
  }
  const hostname = requestHostname(request.headers) ?? request.nextUrl.hostname;
  if (hostname !== LANDING_HOST) {
    return rememberLinkPreferences(request) ?? renderWith(request);
  }
  const legal = legalDocumentAt(pathname);
  if (legal !== undefined && legalConfig() !== null) {
    const internal = new URL(internalLegalPathOf(legal), request.url);
    internal.search = search;
    return renderWith(
      request,
      { [PATH_LOCALE_HEADER]: CONTRACT_LANGUAGE },
      { to: internal, apiOrigin: undefined },
    );
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
  return renderWith(
    request,
    { [PATH_LOCALE_HEADER]: page.locale },
    { to: internal, apiOrigin: apiOriginFrom(landingIngestionUrl()) },
  );
}

export function proxy(request: NextRequest) {
  if (isDemoMode()) {
    return landingOrDemo(request);
  }
  const remembered = rememberLinkPreferences(request);
  if (remembered !== undefined) {
    return remembered;
  }
  const { pathname, search, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  const onSignIn = pathname === SIGN_IN_PATH;
  const onSignUp = pathname === SIGN_UP_PATH;

  if (!hasSession && !onSignIn && !onSignUp) {
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
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|robots.txt|sitemap.xml|llms.txt|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)',
  ],
};
