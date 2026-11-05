import { getI18n } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { demoSharedAnswer } from '@/lib/demo-shared-answers';

const STATUS_NOT_FOUND = 404;

export interface DemoSharedRouteContext {
  readonly params: Promise<{ readonly token: string; readonly report?: readonly string[] }>;
}

export async function GET(request: Request, { params }: DemoSharedRouteContext): Promise<Response> {
  if (!isDemoMode()) {
    return new Response(null, { status: STATUS_NOT_FOUND });
  }
  const { token, report = [] } = await params;
  const answer = demoSharedAnswer(
    token,
    report,
    new URL(request.url).searchParams,
    await getI18n(),
    new Date(),
  );
  return Response.json(answer.body, {
    status: answer.status,
    headers: { 'cache-control': 'no-store' },
  });
}
