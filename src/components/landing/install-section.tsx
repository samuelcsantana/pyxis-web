import type { I18n } from '@/i18n/i18n';
import { type CopyCodeLabels, CopyCodeButton } from './copy-code-button';
import { REVEAL } from './landing-classes';
import { LandingSection } from './landing-section';

export interface InstallSectionProps {
  readonly i18n: I18n;
}

export const INSTALL_ID = 'install';

type TokenKind = 'plain' | 'keyword' | 'string';

interface CodeToken {
  readonly kind: TokenKind;
  readonly text: string;
}

const TOKEN_CLASSES: Readonly<Record<TokenKind, string>> = {
  plain: 'text-nav-strong',
  keyword: 'text-accent',
  string: 'text-nav-text',
};

const plain = (text: string): CodeToken => ({ kind: 'plain', text });
const keyword = (text: string): CodeToken => ({ kind: 'keyword', text });
const quoted = (text: string): CodeToken => ({ kind: 'string', text: `'${text}'` });

export const INSTALL_COMMAND: readonly CodeToken[] = [plain('npm install pyxis-analytics')];

export const FIRST_EVENT: readonly CodeToken[] = [
  keyword('import'),
  plain(' { init, track } '),
  keyword('from'),
  plain(' '),
  quoted('pyxis-analytics'),
  plain(';\n\ninit({ key: '),
  quoted('pyxis_pk_…'),
  plain(', endpoint: '),
  quoted('https://api.pyxis-analytics.dev'),
  plain(' });\ntrack('),
  quoted('signup_completed'),
  plain(', { method: '),
  quoted('email_code'),
  plain(' });'),
];

export function codeTextOf(tokens: readonly CodeToken[]): string {
  return tokens.map((token) => token.text).join('');
}

interface CodeBlockProps {
  readonly id: string;
  readonly tokens: readonly CodeToken[];
  readonly labels: CopyCodeLabels;
}

function CodeBlock({ id, tokens, labels }: CodeBlockProps) {
  return (
    <div className="relative overflow-x-auto rounded-card bg-nav py-4.5 pr-24 pl-5 font-mono text-sm leading-7">
      <pre id={id} className="m-0">
        <code>
          {tokens.map((token, index) => (
            <span key={`${String(index)}-${token.text}`} className={TOKEN_CLASSES[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
      <CopyCodeButton code={codeTextOf(tokens)} targetId={id} labels={labels} />
    </div>
  );
}

const INFO_ICON = 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M12 11v5.5 M12 7.5h.01';

export function InstallSection({ i18n }: InstallSectionProps) {
  const { t } = i18n;
  const labels = {
    copy: t('landing.install.copy'),
    copied: t('landing.install.copied'),
    selected: t('landing.install.selected'),
  };
  return (
    <LandingSection
      id={INSTALL_ID}
      eyebrow={t('landing.install.eyebrow')}
      title={t('landing.install.title')}
      lead={t('landing.install.lead')}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className={`flex min-w-0 flex-col gap-2.5 ${REVEAL}`}>
          <CodeBlock id="install-command" tokens={INSTALL_COMMAND} labels={labels} />
          <CodeBlock id="install-first-event" tokens={FIRST_EVENT} labels={labels} />
        </div>
        <p
          className={`flex gap-2.5 rounded-card border border-line bg-card px-4.5 py-4 text-sm leading-relaxed text-muted ${REVEAL}`}
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-ink"
          >
            <path
              d={INFO_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t('landing.install.note')}
        </p>
      </div>
    </LandingSection>
  );
}
