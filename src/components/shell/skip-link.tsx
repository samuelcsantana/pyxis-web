import { NAV_FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';

export const CONTENT_ID = 'content';

const SHOWN_WHEN_FOCUSED =
  'focus:fixed focus:top-2 focus:left-2 focus:z-40 focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:px-4 focus:py-2.5 focus:[clip-path:none]';

export interface SkipLinkProps {
  readonly i18n: I18n;
}

export function SkipLink({ i18n }: SkipLinkProps) {
  return (
    <a
      href={`#${CONTENT_ID}`}
      className={`sr-only rounded-input bg-accent text-sm font-semibold whitespace-nowrap text-accent-ink ${SHOWN_WHEN_FOCUSED} ${NAV_FOCUS_RING}`}
    >
      {i18n.t('shell.skipToContent')}
    </a>
  );
}
