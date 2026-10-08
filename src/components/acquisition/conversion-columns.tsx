import type { ConversionFigures } from '@/domain/acquisition';
import type { I18n } from '@/i18n/i18n';
import { BODY_CELL, HEADER_CELL } from '@/components/ui/panel-classes';

export interface ConversionColumnsProps {
  readonly i18n: I18n;
}

export function ConversionColumns({ i18n }: ConversionColumnsProps) {
  return (
    <>
      <th scope="col" className={`${HEADER_CELL} hidden text-right sm:table-cell`}>
        {i18n.t('acquisition.conversionColumns.conversions')}
      </th>
      <th scope="col" className={`${HEADER_CELL} pr-0 text-right sm:w-52 sm:text-left`}>
        {i18n.t('acquisition.conversionColumns.conversionRate')}
      </th>
    </>
  );
}

export interface ConversionCellsProps {
  readonly row: ConversionFigures;
  readonly i18n: I18n;
}

export function ConversionCells({ row, i18n }: ConversionCellsProps) {
  return (
    <>
      <td className={`${BODY_CELL} hidden text-right sm:table-cell`}>{row.conversions}</td>
      <td className={`${BODY_CELL} pr-0`}>
        <span className="flex items-center justify-end gap-2.5">
          <span aria-hidden="true" className="hidden h-1.5 grow rounded-pill bg-soft sm:block">
            <span className="block h-1.5 rounded-pill bg-ok" style={{ width: row.barWidth }} />
          </span>
          <span className="flex flex-col items-end gap-0.5 text-right sm:w-12">
            <span className="font-semibold">{row.conversionRate}</span>
            {row.conversions === null ? null : (
              <span className="text-xs whitespace-nowrap text-muted sm:hidden">
                {i18n.t('acquisition.conversionColumns.converted', {
                  conversions: row.conversions,
                })}
              </span>
            )}
          </span>
        </span>
      </td>
    </>
  );
}
