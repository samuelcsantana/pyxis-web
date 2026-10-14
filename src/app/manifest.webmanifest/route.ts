import { WEB_APP_MANIFEST_CONTENT_TYPE, dashboardManifest } from '@/lib/web-app-manifest';

export function GET(): Response {
  return Response.json(dashboardManifest(), {
    headers: { 'content-type': WEB_APP_MANIFEST_CONTENT_TYPE },
  });
}
