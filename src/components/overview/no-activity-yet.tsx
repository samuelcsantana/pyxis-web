import { EmptyState } from '@/components/states/empty-state';

export const PLACEHOLDER_ENDPOINT = 'https://api.pyxis.example.com';
const SDK_README_URL = 'https://github.com/samuelcsantana/pyxis-sdk#readme';

export interface NoActivityYetProps {
  readonly endpoint: string | undefined;
}

export function installSnippet(endpoint: string): string {
  return [
    'npm install pyxis-analytics',
    '',
    "import { init } from 'pyxis-analytics';",
    `init({ key: 'pyxis_pk_…', endpoint: '${endpoint}' });`,
  ].join('\n');
}

export function NoActivityYet({ endpoint }: NoActivityYetProps) {
  return (
    <EmptyState title="No events in this period yet">
      <p>Install the SDK on your site and the first page views show up here within a minute.</p>
      <pre className="rounded-input bg-nav px-4 py-3.5 font-mono text-xs leading-5 whitespace-pre-wrap text-nav-text wrap-anywhere">
        <code>{installSnippet(endpoint ?? PLACEHOLDER_ENDPOINT)}</code>
      </pre>
      <p>
        The full setup guide is in the{' '}
        <a
          href={SDK_README_URL}
          className="text-sky-ink underline underline-offset-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          SDK&apos;s README
        </a>
        .
      </p>
    </EmptyState>
  );
}
