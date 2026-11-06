import { getI18n } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { demoSharedAnswer, demoUnlockAnswer } from '@/lib/demo-shared-answers';

const STATUS_NOT_FOUND = 404;
const UNLOCK_REPORT = 'unlock';
const BEARER_PREFIX = 'Bearer ';
const NOT_STORED = { 'cache-control': 'no-store' };

export interface DemoSharedRouteContext {
  readonly params: Promise<{ readonly token: string; readonly report?: readonly string[] }>;
}

function bearerOf(request: Request): string | null {
  const header = request.headers.get('authorization');
  return header?.startsWith(BEARER_PREFIX) === true ? header.slice(BEARER_PREFIX.length) : null;
}

async function passwordOf(request: Request): Promise<unknown> {
  const body: unknown = await request.json().catch(() => null);
  return typeof body === 'object' && body !== null && 'password' in body ? body.password : null;
}

function notFound(): Response {
  return new Response(null, { status: STATUS_NOT_FOUND });
}

export async function GET(request: Request, { params }: DemoSharedRouteContext): Promise<Response> {
  if (!isDemoMode()) {
    return notFound();
  }
  const { token, report = [] } = await params;
  const answer = demoSharedAnswer(
    token,
    report,
    new URL(request.url).searchParams,
    await getI18n(),
    new Date(),
    bearerOf(request),
  );
  return Response.json(answer.body, { status: answer.status, headers: NOT_STORED });
}

export async function POST(
  request: Request,
  { params }: DemoSharedRouteContext,
): Promise<Response> {
  const { token, report = [] } = await params;
  if (!isDemoMode() || report.join('/') !== UNLOCK_REPORT) {
    return notFound();
  }
  const answer = demoUnlockAnswer(token, await passwordOf(request), new Date());
  return Response.json(answer.body, { status: answer.status, headers: NOT_STORED });
}
