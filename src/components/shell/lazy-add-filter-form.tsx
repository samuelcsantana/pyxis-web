'use client';

import { lazy, Suspense } from 'react';
import type { AddFilterFormProps } from './add-filter-form';
import { useWantedWhenOpen } from './use-wanted-when-open';

function FormPlaceholder() {
  return (
    <div
      aria-hidden="true"
      data-testid="add-filter-placeholder"
      className="h-60 w-full rounded-input bg-grid motion-safe:animate-pulse"
    />
  );
}

const AddFilterForm = lazy(() =>
  import('./add-filter-form').then((form) => ({ default: form.AddFilterForm })),
);

export interface LazyAddFilterFormProps extends AddFilterFormProps {
  readonly openAtFirst: boolean;
}

export function LazyAddFilterForm({ openAtFirst, ...form }: LazyAddFilterFormProps) {
  const { anchor, wanted } = useWantedWhenOpen(openAtFirst);
  return (
    <div ref={anchor}>
      {wanted ? (
        <Suspense fallback={<FormPlaceholder />}>
          <AddFilterForm {...form} />
        </Suspense>
      ) : (
        <FormPlaceholder />
      )}
    </div>
  );
}
