import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandedPage } from '@/components/brand/branded-page';
import {
  ConnectionRequestGone,
  ConnectionRequestView,
} from '@/components/connect/connection-request-view';
import { connectionRequestIdSchema } from '@/domain/connection-requests.schema';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { currentAdmin, readOrSignIn } from '@/lib/current-admin';
import { createConnectionRequestsService } from '@/services/connection-requests/connection-requests-service.factory';
import { allowConnection, denyConnection } from './actions';

export interface ConnectPageProps {
  readonly searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}

async function requestIdOrNotFound(searchParams: ConnectPageProps['searchParams']) {
  if (isDemoMode()) {
    notFound();
  }
  const requestId = connectionRequestIdSchema.safeParse((await searchParams).request);
  if (!requestId.success) {
    notFound();
  }
  return requestId.data;
}

export async function generateMetadata({ searchParams }: ConnectPageProps): Promise<Metadata> {
  await requestIdOrNotFound(searchParams);
  const t = await getTranslator();
  return { title: t('connect.title') };
}

export default async function ConnectPage({ searchParams }: ConnectPageProps) {
  const requestId = await requestIdOrNotFound(searchParams);
  const admin = await currentAdmin();
  const request = await readOrSignIn(() => createConnectionRequestsService().find(requestId));
  const i18n = await getI18n();
  return (
    <BrandedPage>
      {request === null ? (
        <ConnectionRequestGone i18n={i18n} />
      ) : (
        <ConnectionRequestView
          request={request}
          email={admin.email}
          i18n={i18n}
          allow={allowConnection.bind(null, request.id)}
          deny={denyConnection.bind(null, request.id)}
        />
      )}
    </BrandedPage>
  );
}
