'use client';

import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import type { TrackingStatus } from 'pyxis-analytics';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { landingMeasurement, type Measurement } from './landing-measurement';
import type { MeasurementLabels } from './measurement-labels';

export interface MeasurementNoteProps {
  readonly labels: MeasurementLabels;
  readonly measurement?: Measurement;
}

const ACTION = `rounded-control text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const unknownOnTheServer = () => null;

function Action({ label, onClick }: { readonly label: string; readonly onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={ACTION}>
      {label}
    </button>
  );
}

type Note = (labels: MeasurementLabels, measurement: Measurement) => ReactNode;

const NOTES: Readonly<Record<TrackingStatus, Note>> = {
  on: (labels, measurement) => (
    <>
      {labels.measured}{' '}
      <Action
        label={labels.see}
        onClick={() => {
          measurement.setDrawerOpen(true);
        }}
      />
      {' · '}
      <Action label={labels.optOut} onClick={measurement.stop} />
    </>
  ),
  'opted-out': (labels, measurement) => (
    <>
      {labels.off} <Action label={labels.optIn} onClick={measurement.resume} />
    </>
  ),
  'blocked-by-browser': (labels) => labels.blocked,
};

export function MeasurementNote({
  labels,
  measurement = landingMeasurement,
}: MeasurementNoteProps) {
  const status = useSyncExternalStore(
    measurement.subscribe,
    measurement.status,
    unknownOnTheServer,
  );
  if (status === null) {
    return null;
  }
  return <p className="text-caption text-muted">{NOTES[status](labels, measurement)}</p>;
}
