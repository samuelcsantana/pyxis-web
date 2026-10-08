import { TEXT_LINK } from './control-classes';

export interface CsvDownload {
  readonly label: string;
  readonly href: string;
}

export interface CsvDownloadsProps {
  readonly downloads: readonly CsvDownload[];
}

const DOWNLOAD_ICON = 'M12 4v11 M7 10l5 5 5-5 M5 20h14';

export function CsvDownloads({ downloads }: CsvDownloadsProps) {
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
        Download CSV
      </span>
      {downloads.map((download) => (
        <a
          key={download.href}
          href={download.href}
          aria-label={`${download.label} as CSV`}
          className={`inline-flex min-h-6 items-center ${TEXT_LINK}`}
        >
          {download.label}
        </a>
      ))}
    </p>
  );
}
