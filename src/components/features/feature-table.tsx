import type { FeatureKind, FeatureRow } from '@/domain/features';
import type { I18n } from '@/i18n/i18n';
import { HEADER_CELL, PANEL, PANEL_TITLE, TABLE_SCROLL } from '@/components/ui/panel-classes';
import { ExpandableFeatureRow, type LoadProperties } from './expandable-feature-row';
import { FeatureRowCells } from './feature-row-cells';

export interface FeatureTableProps {
  readonly kind: FeatureKind;
  readonly rows: readonly FeatureRow[];
  readonly query: string;
  readonly visitsHref: (name: string) => string;
  readonly loadProperties?: LoadProperties;
  readonly i18n: I18n;
}

function emptyMessage(kind: FeatureKind, query: string, i18n: I18n): string {
  return query === ''
    ? i18n.t(`features.nothingYet.${kind}`)
    : i18n.t('features.noMatch', { query });
}

interface TableRowProps {
  readonly kind: FeatureKind;
  readonly row: FeatureRow;
  readonly visitsHref: string;
  readonly visitsPurpose: string;
  readonly loadProperties: LoadProperties | undefined;
}

function TableRow({ kind, row, visitsHref, visitsPurpose, loadProperties }: TableRowProps) {
  if (kind === 'events' && loadProperties !== undefined) {
    return (
      <ExpandableFeatureRow
        row={row}
        visitsHref={visitsHref}
        visitsPurpose={visitsPurpose}
        loadProperties={loadProperties}
      />
    );
  }
  return (
    <tr>
      <FeatureRowCells
        kind={kind}
        row={row}
        visitsHref={visitsHref}
        visitsPurpose={visitsPurpose}
      />
    </tr>
  );
}

export function FeatureTable({
  kind,
  rows,
  query,
  visitsHref,
  loadProperties,
  i18n,
}: FeatureTableProps) {
  return (
    <section aria-labelledby="features-heading" className={PANEL}>
      <h2 id="features-heading" className={PANEL_TITLE}>
        {i18n.t(`features.titles.${kind}`)}
      </h2>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{emptyMessage(kind, query, i18n)}</p>
      ) : (
        <div className={TABLE_SCROLL}>
          <table
            aria-labelledby="features-heading"
            className="w-full border-collapse text-caption tabular-nums"
          >
            <thead>
              <tr>
                <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                  {i18n.t(`features.nameHeaders.${kind}`)}
                </th>
                <th scope="col" className={`${HEADER_CELL} text-right`}>
                  {i18n.t('features.columns.count')}
                </th>
                <th scope="col" className={`${HEADER_CELL} hidden text-right sm:table-cell`}>
                  {i18n.t('features.columns.visits')}
                </th>
                <th scope="col" className={`${HEADER_CELL} hidden text-left md:table-cell`}>
                  {i18n.t('features.columns.trend')}
                </th>
                <th scope="col" className={`${HEADER_CELL} pr-0 text-right sm:w-52 sm:text-left`}>
                  {i18n.t('features.columns.share')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  kind={kind}
                  row={row}
                  visitsHref={visitsHref(row.name)}
                  visitsPurpose={i18n.t('visitsLink.purpose')}
                  loadProperties={loadProperties}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
