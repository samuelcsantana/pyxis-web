import type { I18n } from '@/i18n/i18n';
import { TEXT_LINK } from './control-classes';

export interface CsvDownload {
  readonly label: string;
  readonly href: string;
}

export interface CsvDownloadsProps {
  readonly downloads: readonly CsvDownload[];
  readonly i18n: I18n;
}

const DOWNLOAD_ICON = 'M12 4v11 M7 10l5 5 5-5 M5 20h14';

export function CsvDownloads({ downloads, i18n }: CsvDownloadsProps) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption leading-5">
      <span className="flex items-center gap-1.5 font-medium text-muted">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={DOWNLOAD_ICON} />
        </svg>
        {i18n.t('exports.download')}
      </span>
      {downloads.map((download) => (
        <a
          key={download.href}
          href={download.href}
          aria-label={i18n.t('exports.asCsv', { label: download.label })}
          className={`inline-flex min-h-6 items-center ${TEXT_LINK}`}
        >
          {download.label}
        </a>
      ))}
    </p>
  );
}
