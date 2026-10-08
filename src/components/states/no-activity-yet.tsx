import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { EmptyState } from './empty-state';

export const PLACEHOLDER_ENDPOINT = 'https://api.pyxis.example.com';
const SDK_README_URL = 'https://github.com/samuelcsantana/pyxis-sdk#readme';

export interface NoActivityYetProps {
  readonly endpoint: string | undefined;
  readonly i18n: I18n;
}

export function installSnippet(endpoint: string): string {
  return [
    'npm install pyxis-analytics',
    '',
    "import { init } from 'pyxis-analytics';",
    `init({ key: 'pyxis_pk_…', endpoint: '${endpoint}' });`,
  ].join('\n');
}

export function NoActivityYet({ endpoint, i18n }: NoActivityYetProps) {
  return (
    <EmptyState title={i18n.t('states.noActivity.title')}>
      <p>{i18n.t('states.noActivity.install')}</p>
      <pre className="rounded-input bg-nav px-4 py-3.5 font-mono text-xs leading-5 whitespace-pre-wrap text-nav-text wrap-anywhere">
        <code>{installSnippet(endpoint ?? PLACEHOLDER_ENDPOINT)}</code>
      </pre>
      <p>
        {rich(i18n.t('states.noActivity.guide'), {
          readme: (text) => (
            <a href={SDK_README_URL} className={TEXT_LINK}>
              {text}
            </a>
          ),
        })}
      </p>
    </EmptyState>
  );
}
