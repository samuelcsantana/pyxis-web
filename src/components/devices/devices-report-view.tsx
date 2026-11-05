import { CitiesTable } from '@/components/devices/cities-table';
import { CountriesTable } from '@/components/devices/countries-table';
import type { RowFilter } from '@/components/ui/row-filter-link';
import { BROWSER_FAMILIES, OS_FAMILIES } from '@/domain/dashboard-filters';
import { type RowFilterOf } from '@/lib/row-filters';
import { DeviceConversionList } from '@/components/devices/device-conversion-list';
import { ReachCard } from '@/components/devices/reach-card';
import { RegionsTable } from '@/components/devices/regions-table';
import { ShareDonut } from '@/components/devices/share-donut';
import { NoGoals } from '@/components/states/no-goals';
import { CsvDownloads } from '@/components/ui/csv-downloads';
import {
  browserLabel,
  cityRows,
  type CityFilterValue,
  countryLabel,
  deviceConversions,
  type DevicesReport,
  deviceTypeLabel,
  hasNamedCity,
  operatingSystemLabel,
  OTHER_VALUE,
  reachSummary,
  regionRows,
  shareRows,
} from '@/domain/devices';
import { devicesTableLabel } from '@/domain/devices-export';
import { countryFilterOf, deviceFilterOf } from '@/domain/visits';
import { type Goal } from '@/domain/goals';
import type { I18n } from '@/i18n/i18n';

function familyOf<Family extends string>(
  families: readonly Family[],
  value: string,
): Family | null {
  return value === OTHER_VALUE ? null : (families.find((family) => family === value) ?? null);
}

export type VisitsLinkOf = ((filter: Readonly<Record<string, string>>) => string) | null;

export function devicesLinksOf(
  visitsLink: VisitsLinkOf,
  rowFilter: RowFilterOf,
  i18n: I18n,
): DevicesLinks {
  const visits = (filter: Readonly<Record<string, string>> | null) =>
    filter === null || visitsLink === null ? null : visitsLink(filter);
  const browserOf = (value: string) => familyOf(BROWSER_FAMILIES, value);
  const osOf = (value: string) => familyOf(OS_FAMILIES, value);
  return {
    deviceVisitsHref: (deviceType) => {
      const device = deviceFilterOf(deviceType);
      return visits(device === null ? null : { device });
    },
    countryVisitsHref: (value) => {
      const country = countryFilterOf(value);
      return visits(country === null ? null : { country });
    },
    regionVisitsHref: (region) => visits({ region }),
    cityVisitsHref: ({ region, city }) => visits({ region, city }),
    deviceFilter: (deviceType) => {
      const device = deviceType === OTHER_VALUE ? null : deviceFilterOf(deviceType);
      return device === null ? null : rowFilter({ device }, deviceTypeLabel(device, i18n));
    },
    browserVisitsHref: (value) => {
      const browser = browserOf(value);
      return visits(browser === null ? null : { browser });
    },
    browserFilter: (value) => {
      const browser = browserOf(value);
      return browser === null ? null : rowFilter({ browser }, browserLabel(browser, i18n));
    },
    osVisitsHref: (value) => {
      const os = osOf(value);
      return visits(os === null ? null : { os });
    },
    osFilter: (value) => {
      const os = osOf(value);
      return os === null ? null : rowFilter({ os }, operatingSystemLabel(os, i18n));
    },
    countryFilter: (value) => {
      const country = countryFilterOf(value);
      return country === null ? null : rowFilter({ country }, countryLabel(country, i18n));
    },
    regionFilter: (region) => rowFilter({ region }, region),
    cityFilter: ({ region, city }) => rowFilter({ region, city }, city),
  };
}

export interface DevicesReportViewProps {
  readonly report: DevicesReport;
  readonly projectId: string | null;
  readonly countedGoal: Goal | null;
  readonly cityEnabled: boolean;
  readonly exportPath: string | null;
  readonly links: DevicesLinks;
  readonly i18n: I18n;
}

export interface DevicesLinks {
  readonly deviceVisitsHref: (deviceType: string) => string | null;
  readonly countryVisitsHref: (country: string) => string | null;
  readonly regionVisitsHref: (region: string) => string | null;
  readonly cityVisitsHref: (city: CityFilterValue) => string | null;
  readonly deviceFilter: (deviceType: string) => RowFilter | null;
  readonly browserVisitsHref: (browser: string) => string | null;
  readonly browserFilter: (browser: string) => RowFilter | null;
  readonly osVisitsHref: (os: string) => string | null;
  readonly osFilter: (os: string) => RowFilter | null;
  readonly countryFilter: (country: string) => RowFilter | null;
  readonly regionFilter: (region: string) => RowFilter;
  readonly cityFilter: (city: CityFilterValue) => RowFilter;
}

export function DevicesReportView({
  report,
  projectId,
  countedGoal,
  cityEnabled,
  exportPath,
  links,
  i18n,
}: DevicesReportViewProps) {
  const conversions = deviceConversions(report.deviceTypes, i18n);
  const counts = countedGoal !== null;
  const showsConversions = countedGoal !== null && conversions.length > 0;
  return (
    <>
      <ReachCard summary={reachSummary(report.reach, cityEnabled, i18n)} i18n={i18n} />
      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 sm:[&>:last-child:nth-child(odd)]:col-span-full xl:grid-cols-3 xl:[&>:last-child:nth-child(odd)]:col-span-1">
        <ShareDonut
          id="device-type"
          title={i18n.t('devices.panels.deviceType')}
          rows={shareRows(report.deviceTypes, deviceTypeLabel, i18n)}
          visitsHref={links.deviceVisitsHref}
          filterOf={links.deviceFilter}
          i18n={i18n}
        />
        <ShareDonut
          id="browser"
          title={i18n.t('devices.panels.browser')}
          rows={shareRows(report.browsers, browserLabel, i18n)}
          withConversionRate={counts}
          visitsHref={links.browserVisitsHref}
          filterOf={links.browserFilter}
          i18n={i18n}
        />
        <ShareDonut
          id="operating-system"
          title={i18n.t('devices.panels.operatingSystem')}
          rows={shareRows(report.operatingSystems, operatingSystemLabel, i18n)}
          withConversionRate={counts}
          visitsHref={links.osVisitsHref}
          filterOf={links.osFilter}
          i18n={i18n}
        />
      </div>
      {countedGoal === null && projectId !== null ? (
        <NoGoals projectId={projectId} i18n={i18n} />
      ) : null}
      <div className="grid gap-3.5 sm:gap-4 xl:grid-cols-2 xl:[&>:last-child:nth-child(odd)]:col-span-full">
        {showsConversions ? (
          <DeviceConversionList conversions={conversions} goal={countedGoal.name} i18n={i18n} />
        ) : null}
        <CountriesTable
          rows={shareRows(report.countries, countryLabel, i18n)}
          withConversionRate={counts}
          visitsHref={links.countryVisitsHref}
          filterOf={links.countryFilter}
          i18n={i18n}
        />
        <RegionsTable
          rows={regionRows(report.regions, i18n)}
          withConversionRate={counts}
          visitsHref={links.regionVisitsHref}
          filterOf={links.regionFilter}
          i18n={i18n}
        />
      </div>
      {cityEnabled || hasNamedCity(report.cities) ? (
        <CitiesTable
          rows={cityRows(report.cities, i18n)}
          withConversionRate={counts}
          visitsHref={links.cityVisitsHref}
          filterOf={links.cityFilter}
          i18n={i18n}
        />
      ) : null}
      {exportPath === null ? null : (
        <CsvDownloads
          downloads={[{ label: devicesTableLabel(i18n), href: exportPath }]}
          i18n={i18n}
        />
      )}
      <p className="text-xs leading-[18px] text-muted">{i18n.t('devices.footnote')}</p>
    </>
  );
}
