import { NAV_FOCUS_RING } from '@/components/ui/control-classes';

export const CONTENT_ID = 'content';

const SHOWN_WHEN_FOCUSED =
  'focus:fixed focus:top-2 focus:left-2 focus:z-40 focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:px-4 focus:py-2.5 focus:[clip-path:none]';

export function SkipLink() {
  return (
    <a
      href={`#${CONTENT_ID}`}
      className={`sr-only rounded-input bg-accent text-sm font-semibold whitespace-nowrap text-accent-ink ${SHOWN_WHEN_FOCUSED} ${NAV_FOCUS_RING}`}
    >
      Skip to content
    </a>
  );
}
