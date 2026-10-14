import { isDemoMode } from '@/lib/api-config';
import { WEB_APP_MANIFEST_CONTENT_TYPE, dashboardManifest } from '@/lib/web-app-manifest';

const STATUS_NOT_FOUND = 404;

export function GET(): Response {
  if (isDemoMode()) {
    return new Response(null, { status: STATUS_NOT_FOUND });
  }
  return Response.json(dashboardManifest(), {
    headers: { 'content-type': WEB_APP_MANIFEST_CONTENT_TYPE },
  });
}
