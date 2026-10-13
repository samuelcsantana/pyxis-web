'use client';

import { useEffect } from 'react';
import { landingMeasurement, type Measurement, trackedClickOf } from './landing-measurement';
import type { RecordedLabels } from './measurement-labels';
import { RecordedDrawer } from './recorded-drawer';

export interface LandingMeasurementBootProps {
  readonly trackingKey: string;
  readonly endpoint: string;
  readonly labels: RecordedLabels;
  readonly locale: string;
  readonly measurement?: Measurement;
}

const TRACKED = '[data-track]';

function clickRecorder(measurement: Measurement): (event: MouseEvent) => void {
  return (event) => {
    const target =
      event.target instanceof Element ? event.target.closest<HTMLElement>(TRACKED) : null;
    const click = target === null ? null : trackedClickOf(target);
    if (click !== null) {
      measurement.record(click.name, click.properties);
    }
  };
}

export function LandingMeasurementBoot({
  trackingKey,
  endpoint,
  labels,
  locale,
  measurement = landingMeasurement,
}: LandingMeasurementBootProps) {
  useEffect(() => {
    measurement.start(trackingKey, endpoint);
  }, [measurement, trackingKey, endpoint]);

  useEffect(() => {
    const recordClick = clickRecorder(measurement);
    document.addEventListener('click', recordClick, { capture: true });
    return () => {
      document.removeEventListener('click', recordClick, { capture: true });
    };
  }, [measurement]);

  return <RecordedDrawer labels={labels} locale={locale} measurement={measurement} />;
}
