import type { DeviceConversion } from '@/domain/devices';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

export interface DeviceConversionListProps {
  readonly conversions: readonly DeviceConversion[];
  readonly conversionEvent: string;
  readonly i18n: I18n;
}

export function DeviceConversionList({
  conversions,
  conversionEvent,
  i18n,
}: DeviceConversionListProps) {
  return (
    <section aria-labelledby="device-conversion-heading" className={`${PANEL} gap-3.5`}>
      <div className="flex flex-col gap-1">
        <h2 id="device-conversion-heading" className={PANEL_TITLE}>
          {i18n.t('devices.conversionByDevice.title')}
        </h2>
        <p className="text-caption text-muted">
          {rich(i18n.t('devices.conversionByDevice.description'), {
            code: () => <code className="font-mono">{conversionEvent}</code>,
          })}
        </p>
      </div>
      <ul className="flex flex-col gap-3.5">
        {conversions.map((conversion) => (
          <li key={conversion.label} className="flex flex-col gap-1.5">
            <span className="flex flex-wrap justify-between gap-x-2 text-caption">
              <span>{conversion.label}</span>
              <span className="font-semibold tabular-nums">
                {conversion.rate}{' '}
                <span className="font-normal text-muted">· {conversion.detail}</span>
              </span>
            </span>
            <span aria-hidden="true" className="block h-2.5 rounded-pill bg-soft">
              <span
                className="block h-2.5 rounded-pill bg-accent"
                style={{ width: conversion.barWidth }}
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
