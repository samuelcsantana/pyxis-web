import { CountriesTable } from '@/components/devices/countries-table';
import { DeviceConversionList } from '@/components/devices/device-conversion-list';
import { RegionsTable } from '@/components/devices/regions-table';
import { ShareDonut } from '@/components/devices/share-donut';
import { ScreenContent } from '@/components/shell/screen-content';
import { linkWith, screenHref } from '@/components/shell/screens';
import { EmptyPeriod } from '@/components/states/empty-period';
import { FilteredPeriodEmpty } from '@/components/states/filtered-period-empty';
import { NoConversionEvent } from '@/components/states/no-conversion-event';
import { CsvDownloads } from '@/components/ui/csv-downloads';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import {
  browserLabel,
  countryLabel,
  deviceConversions,
  type DevicesReport,
  deviceTypeLabel,
  hasVisits,
  operatingSystemLabel,
  regionRows,
  shareRows,
} from '@/domain/devices';
import { devicesTableLabel } from '@/domain/devices-export';
import { describePeriod, type PeriodSearch, periodQuery, resolvePeriod } from '@/domain/period';
import { countryFilterOf, deviceFilterOf } from '@/domain/visits';
import {
  type DashboardSearch,
  dashboardFiltersOf,
  hasDashboardFilters,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { apiBaseUrl } from '@/lib/api-config';
import { exportHref } from '@/lib/csv-export';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { createDevicesService } from '@/services/devices/devices-service.factory';

export const generateMetadata = screenMetadata('devices');

export interface DevicesPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & DashboardSearch>;
}

interface DevicesReportViewProps {
  readonly report: DevicesReport;
  readonly conversionEvent: string | null;
  readonly exportPath: string;
  readonly deviceVisitsHref: (deviceType: string) => string | null;
  readonly i18n: I18n;
  readonly countryVisitsHref: (country: string) => string | null;
  readonly regionVisitsHref: (region: string) => string | null;
}

function DevicesReportView({
  report,
  conversionEvent,
  exportPath,
  deviceVisitsHref,
  i18n,
  countryVisitsHref,
  regionVisitsHref,
}: DevicesReportViewProps) {
  const conversions = deviceConversions(report.deviceTypes, i18n);
  const showsConversions = conversionEvent !== null && conversions.length > 0;
  return (
    <>
      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 sm:[&>:last-child:nth-child(odd)]:col-span-full xl:grid-cols-3 xl:[&>:last-child:nth-child(odd)]:col-span-1">
        <ShareDonut
          id="device-type"
          title={i18n.t('devices.panels.deviceType')}
          rows={shareRows(report.deviceTypes, deviceTypeLabel, i18n)}
          visitsHref={deviceVisitsHref}
          i18n={i18n}
        />
        <ShareDonut
          id="browser"
          title={i18n.t('devices.panels.browser')}
          rows={shareRows(report.browsers, browserLabel, i18n)}
          withConversionRate={conversionEvent !== null}
          i18n={i18n}
        />
        <ShareDonut
          id="operating-system"
          title={i18n.t('devices.panels.operatingSystem')}
          rows={shareRows(report.operatingSystems, operatingSystemLabel, i18n)}
          withConversionRate={conversionEvent !== null}
          i18n={i18n}
        />
      </div>
      {conversionEvent === null ? <NoConversionEvent i18n={i18n} /> : null}
      <div className="grid gap-3.5 sm:gap-4 xl:grid-cols-2 xl:[&>:last-child:nth-child(odd)]:col-span-full">
        {showsConversions ? (
          <DeviceConversionList
            conversions={conversions}
            conversionEvent={conversionEvent}
            i18n={i18n}
          />
        ) : null}
        <CountriesTable
          rows={shareRows(report.countries, countryLabel, i18n)}
          withConversionRate={conversionEvent !== null}
          visitsHref={countryVisitsHref}
          i18n={i18n}
        />
        <RegionsTable
          rows={regionRows(report.regions, i18n)}
          withConversionRate={conversionEvent !== null}
          visitsHref={regionVisitsHref}
          i18n={i18n}
        />
      </div>
      <CsvDownloads
        downloads={[{ label: devicesTableLabel(i18n), href: exportPath }]}
        i18n={i18n}
      />
      <p className="text-xs leading-[18px] text-muted">{i18n.t('devices.footnote')}</p>
    </>
  );
}

export default async function DevicesPage({ params, searchParams }: DevicesPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const i18n = await getI18n();
  const { filters } = dashboardFiltersOf(search, i18n);
  const report = await readOrSignIn(() =>
    createDevicesService().devices(project.id, { from: period.from, to: period.to, filters }),
  );
  const filtered = hasDashboardFilters(filters);
  const query = withDashboardFilters(periodQuery(period), filters);
  const visitsHref = screenHref(project.id, 'visits', query);
  const deviceVisitsHref = (deviceType: string) => {
    const device = deviceFilterOf(deviceType);
    return device === null ? null : linkWith(visitsHref, { device });
  };
  const countryVisitsHref = (value: string) => {
    const country = countryFilterOf(value);
    return country === null ? null : linkWith(visitsHref, { country });
  };
  const regionVisitsHref = (region: string) => linkWith(visitsHref, { region });
  return (
    <ScreenContent
      readAt={now.getTime()}
      filtered={filtered}
      className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12"
    >
      {hasVisits(report) ? (
        <DevicesReportView
          report={report}
          conversionEvent={project.conversionEvent}
          exportPath={exportHref(project.id, 'devices', query)}
          deviceVisitsHref={deviceVisitsHref}
          i18n={i18n}
          countryVisitsHref={countryVisitsHref}
          regionVisitsHref={regionVisitsHref}
        />
      ) : filtered ? (
        <FilteredPeriodEmpty
          periodLabel={describePeriod(period, i18n)}
          removeFiltersHref={screenHref(project.id, 'devices', periodQuery(period))}
          i18n={i18n}
        />
      ) : (
        <EmptyPeriod
          view={emptyPeriodView(project, period, i18n)}
          widerPeriodHref={screenHref(project.id, 'devices', WIDER_PERIOD_QUERY)}
          endpoint={apiBaseUrl()}
          i18n={i18n}
        />
      )}
    </ScreenContent>
  );
}
