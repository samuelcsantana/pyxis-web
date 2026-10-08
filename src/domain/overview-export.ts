import type { I18n } from '@/i18n/i18n';
import type { CsvTable, CsvValue } from './csv';
import type { OverviewReport } from './overview';

export const OVERVIEW_TABLES = ['daily', 'pages', 'events'] as const;
export type OverviewTable = (typeof OVERVIEW_TABLES)[number];

export function overviewTableLabel(table: OverviewTable, i18n: I18n): string {
  return i18n.t(`exports.overview.${table}`);
}

interface DailySeries {
  readonly column: string;
  readonly daily: readonly number[];
}

function dailySeries(kpis: OverviewReport['kpis']): readonly DailySeries[] {
  return [
    { column: 'visits', daily: kpis.visits.daily },
    { column: 'identified_users', daily: kpis.identifiedUsers.daily },
    ...(kpis.conversions === null
      ? []
      : [{ column: 'conversion_events', daily: kpis.conversions.daily }]),
    ...(kpis.convertingVisits === null
      ? []
      : [{ column: 'converting_visits', daily: kpis.convertingVisits.daily }]),
    { column: 'write_requests', daily: kpis.writeErrors.daily.map((day) => day.total) },
    { column: 'failed_writes', daily: kpis.writeErrors.daily.map((day) => day.failed) },
  ];
}

function dailyTable(report: OverviewReport): CsvTable {
  const series = dailySeries(report.kpis);
  return {
    columns: ['date', 'page_views', 'events', ...series.map((entry) => entry.column)],
    rows: report.days.map((day, index): readonly CsvValue[] => [
      day.date,
      day.pageViews,
      day.events,
      ...series.map((entry) => entry.daily[index] ?? null),
    ]),
  };
}

function pagesTable(report: OverviewReport): CsvTable {
  return {
    columns: ['path', 'page_views', 'visits'],
    rows: report.topPages.map((page) => [page.path, page.views, page.visits]),
  };
}

function eventsTable(report: OverviewReport): CsvTable {
  return {
    columns: ['event', 'count', 'visits'],
    rows: report.topEvents.map((event) => [event.name, event.count, event.visits]),
  };
}

const TABLE_BUILDERS: Readonly<Record<OverviewTable, (report: OverviewReport) => CsvTable>> = {
  daily: dailyTable,
  pages: pagesTable,
  events: eventsTable,
};

export function overviewCsvTable(report: OverviewReport, table: OverviewTable): CsvTable {
  return TABLE_BUILDERS[table](report);
}
