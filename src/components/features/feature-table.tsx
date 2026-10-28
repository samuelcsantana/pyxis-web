import type { FeatureKind, FeatureRow } from '@/domain/features';
import type { I18n } from '@/i18n/i18n';
import { FRESH_HIGHLIGHT } from '@/components/ui/fresh-slots';
import type { RowFilter } from '@/components/ui/row-filter-link';
import { HEADER_CELL, PANEL, PANEL_TITLE, TABLE_SCROLL } from '@/components/ui/panel-classes';
import {
  ExpandableFeatureRow,
  type LoadEventSummary,
  type LoadProperties,
} from './expandable-feature-row';
import { FeatureRowCells } from './feature-row-cells';

export interface FeatureTableProps {
  readonly kind: FeatureKind;
  readonly rows: readonly FeatureRow[];
  readonly query: string;
  readonly visitsHref: (name: string) => string;
  readonly filterOf?: (name: string) => RowFilter | null;
  readonly loadProperties?: LoadProperties;
  readonly loadSummary?: LoadEventSummary;
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
  readonly filter: RowFilter | null;
  readonly loadProperties: LoadProperties | undefined;
  readonly loadSummary: LoadEventSummary | undefined;
}

function TableRow({
  kind,
  row,
  visitsHref,
  visitsPurpose,
  filter,
  loadProperties,
  loadSummary,
}: TableRowProps) {
  if (kind === 'events' && loadProperties !== undefined) {
    return (
      <ExpandableFeatureRow
        row={row}
        visitsHref={visitsHref}
        visitsPurpose={visitsPurpose}
        filter={filter}
        loadProperties={loadProperties}
        loadSummary={loadSummary}
      />
    );
  }
  return (
    <tr className={FRESH_HIGHLIGHT}>
      <FeatureRowCells
        kind={kind}
        row={row}
        visitsHref={visitsHref}
        visitsPurpose={visitsPurpose}
        filter={filter}
      />
    </tr>
  );
}

const NO_ROW_FILTER = () => null;

export function FeatureTable({
  kind,
  rows,
  query,
  visitsHref,
  filterOf = NO_ROW_FILTER,
  loadProperties,
  loadSummary,
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
                  filter={filterOf(row.name)}
                  visitsPurpose={i18n.t('visitsLink.purpose')}
                  loadProperties={loadProperties}
                  loadSummary={loadSummary}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
