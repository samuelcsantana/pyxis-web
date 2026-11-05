import { Suspense } from 'react';
import { renderSharedAction, sharedRequestsAction } from '@/app/share/[token]/actions';
import type { SharedScreen } from '@/domain/shared-project';
import type { I18n } from '@/i18n/i18n';
import { apiBaseUrl } from '@/lib/api-config';
import { MadeWithPyxis } from './made-with-pyxis';
import { SharedReport } from './shared-report';

export interface SharedPageProps {
  readonly token: string;
  readonly screen: SharedScreen;
  readonly i18n: I18n;
}

export function SharedPage({ token, screen, i18n }: SharedPageProps) {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <MadeWithPyxis i18n={i18n} />
      <main id="content">
        <Suspense>
          <SharedReport
            token={token}
            screen={screen}
            apiBase={apiBaseUrl() ?? ''}
            requestsAction={sharedRequestsAction}
            renderAction={renderSharedAction}
          />
        </Suspense>
      </main>
    </div>
  );
}
