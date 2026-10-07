import { CountriesTable } from '@/components/devices/countries-table';
import { DeviceConversionList } from '@/components/devices/device-conversion-list';
import { ShareDonut } from '@/components/devices/share-donut';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { NoActivityYet } from '@/components/states/no-activity-yet';
import {
  browserLabel,
  countryLabel,
  deviceConversions,
  type DevicesReport,
  deviceTypeLabel,
  hasVisits,
  operatingSystemLabel,
  shareRows,
} from '@/domain/devices';
import { type PeriodSearch, resolvePeriod, todayIn } from '@/domain/period';
import { apiBaseUrl } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { createDevicesService } from '@/services/devices/devices-service.factory';

export const generateMetadata = screenMetadata('Devices');

export interface DevicesPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch>;
}

interface DevicesReportViewProps {
  readonly report: DevicesReport;
  readonly conversionEvent: string | null;
}

function DevicesReportView({ report, conversionEvent }: DevicesReportViewProps) {
  const conversions = deviceConversions(report.deviceTypes);
  return (
    <>
      <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] sm:gap-4">
        <ShareDonut
          id="device-type"
          title="Device type"
          rows={shareRows(report.deviceTypes, deviceTypeLabel)}
        />
        <ShareDonut id="browser" title="Browser" rows={shareRows(report.browsers, browserLabel)} />
        <ShareDonut
          id="operating-system"
          title="Operating system"
          rows={shareRows(report.operatingSystems, operatingSystemLabel)}
        />
      </div>
      <div className="grid gap-3.5 sm:gap-4 xl:grid-cols-2">
        {conversionEvent === null || conversions.length === 0 ? null : (
          <DeviceConversionList conversions={conversions} conversionEvent={conversionEvent} />
        )}
        <CountriesTable rows={shareRows(report.countries, countryLabel)} />
      </div>
      <p className="text-xs leading-[18px] text-muted">
        Device, browser and system are worked out on the server from the browser&apos;s user agent,
        which is then thrown away. The country comes from the edge network, never from a stored IP
        address.
      </p>
    </>
  );
}

export default async function DevicesPage({ params, searchParams }: DevicesPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const now = new Date();
  const period = resolvePeriod(await searchParams, project.timezone, now);
  const report = await readOrSignIn(() =>
    createDevicesService().devices(project.id, { from: period.from, to: period.to }),
  );
  return (
    <>
      <Topbar
        title="Devices"
        subtitle={`What people use to reach ${project.name}`}
        basePath={screenHref(project.id, 'devices')}
        period={period}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
      />
      <main className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        {hasVisits(report) ? (
          <DevicesReportView report={report} conversionEvent={project.conversionEvent} />
        ) : (
          <NoActivityYet endpoint={apiBaseUrl()} />
        )}
      </main>
    </>
  );
}
