import { UnauthenticatedError } from '@/domain/errors';
import { createProjectsService } from '@/services/projects/projects-service.factory';

export const PROJECT_ICON_CACHE_CONTROL = 'private, max-age=86400';

const STATUS_UNAUTHORIZED = 401;
const STATUS_NOT_FOUND = 404;

export interface ProjectIconContext {
  readonly params: Promise<{ readonly projectId: string }>;
}

export async function GET(_request: Request, context: ProjectIconContext): Promise<Response> {
  const { projectId } = await context.params;
  try {
    const icon = await createProjectsService().icon(projectId);
    if (icon === null) {
      return new Response(null, { status: STATUS_NOT_FOUND });
    }
    return new Response(icon.bytes, {
      headers: {
        'content-type': icon.contentType,
        'cache-control': PROJECT_ICON_CACHE_CONTROL,
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return new Response(null, { status: STATUS_UNAUTHORIZED });
    }
    throw error;
  }
}
