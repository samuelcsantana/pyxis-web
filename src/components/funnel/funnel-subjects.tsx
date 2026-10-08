import Link from 'next/link';
import type { FunnelSubjectsView } from '@/domain/funnel-subjects';
import { TEXT_LINK } from '@/components/ui/control-classes';
import {
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
  ROW_LINK,
  TABLE_SCROLL,
} from '@/components/ui/panel-classes';

export const FUNNEL_SUBJECTS_ID = 'funnel-subjects';
const HEADING_ID = 'funnel-subjects-heading';

export interface FunnelSubjectsProps {
  readonly view: FunnelSubjectsView;
  readonly olderHref: string | null;
  readonly newestHref: string | null;
  readonly closeHref: string;
}

function PageLink({ href, text }: { href: string | null; text: string }) {
  return href === null ? null : (
    <Link href={href} className={TEXT_LINK}>
      {text}
    </Link>
  );
}

export function FunnelSubjects({ view, olderHref, newestHref, closeHref }: FunnelSubjectsProps) {
  return (
    <section id={FUNNEL_SUBJECTS_ID} aria-labelledby={HEADING_ID} className={PANEL}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={HEADING_ID} className={PANEL_TITLE}>
          {view.heading}
        </h2>
        <Link href={closeHref} className={`${TEXT_LINK} text-sm`}>
          {view.text.close}
        </Link>
      </div>
      {view.rows.length === 0 ? (
        <p className="text-sm text-muted">{view.text.empty}</p>
      ) : (
        <>
          <p className="text-caption text-muted">{view.text.order}</p>
          <div className={TABLE_SCROLL}>
            <table aria-labelledby={HEADING_ID} className="w-full text-sm">
              <thead>
                <tr>
                  <th scope="col" className={`${HEADER_CELL} text-left`}>
                    {view.subjectColumn}
                  </th>
                  <th scope="col" className={`${HEADER_CELL} text-right`}>
                    {view.text.reachedAt}
                  </th>
                </tr>
              </thead>
              <tbody>
                {view.rows.map((row) => (
                  <tr key={row.key}>
                    <td className={BODY_CELL}>
                      <Link
                        href={row.href}
                        aria-label={row.label}
                        className={`${ROW_LINK} font-mono text-xs`}
                      >
                        {row.shown}
                      </Link>
                    </td>
                    <td className={`${BODY_CELL} text-right tabular-nums`}>
                      <time dateTime={row.reachedAt}>{row.reachedAtText}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {olderHref === null && newestHref === null ? null : (
        <div className="flex flex-wrap gap-4 text-sm">
          <PageLink href={newestHref} text={view.text.newest} />
          <PageLink href={olderHref} text={view.text.older} />
        </div>
      )}
    </section>
  );
}
