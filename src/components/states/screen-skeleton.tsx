const PULSE = 'rounded-chip bg-grid motion-safe:animate-pulse';
const CARD = 'rounded-card border border-line bg-card';
const CHART_BAR_HEIGHTS = ['40%', '65%', '50%', '80%', '58%', '72%', '46%', '62%'] as const;
const ROW_WIDTHS = ['w-3/5', 'w-2/5', 'w-1/2', 'w-2/3', 'w-1/3'] as const;
const STEP_WIDTHS = ['w-full', 'w-4/5', 'w-3/5', 'w-2/5'] as const;
const CONTROL_WIDTHS = ['w-20', 'w-24', 'w-28'] as const;

function indexes(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index);
}

function rowWidths(count: number): readonly string[] {
  const rounds = Math.ceil(count / ROW_WIDTHS.length);
  return Array.from({ length: rounds }, () => ROW_WIDTHS)
    .flat()
    .slice(0, count);
}

export function SkeletonCards({ count }: { readonly count: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
      {indexes(count).map((index) => (
        <div key={index} className={`flex flex-col gap-3 p-4 ${CARD}`}>
          <span className={`h-2.5 w-3/5 ${PULSE}`} />
          <span className={`h-6 w-2/5 ${PULSE}`} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className={`flex h-72 flex-col gap-4 p-5 ${CARD}`}>
      <span className={`h-3 w-1/3 ${PULSE}`} />
      <div className="flex grow items-end gap-2">
        {CHART_BAR_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className="flex-1 rounded-t-chip bg-soft motion-safe:animate-pulse"
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonRows({ count }: { readonly count: number }) {
  return (
    <div className={`flex flex-col gap-4 p-5 ${CARD}`}>
      <span className={`h-3 w-1/4 ${PULSE}`} />
      {rowWidths(count).map((width, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className={`h-3 ${width} ${PULSE}`} />
          <span className={`h-3 w-12 ${PULSE}`} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonControls() {
  return (
    <div className="flex flex-wrap gap-2">
      {CONTROL_WIDTHS.map((width) => (
        <span
          key={width}
          className={`h-9 ${width} rounded-pill bg-grid motion-safe:animate-pulse`}
        />
      ))}
    </div>
  );
}

export function SkeletonForm({ fields }: { readonly fields: number }) {
  return (
    <div className={`grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 ${CARD}`}>
      {indexes(fields).map((index) => (
        <div key={index} className="flex flex-col gap-2">
          <span className={`h-2.5 w-1/3 ${PULSE}`} />
          <span className="h-10 rounded-input border border-line bg-soft motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonSteps() {
  return (
    <div className={`flex flex-col gap-4 p-5 ${CARD}`}>
      {STEP_WIDTHS.map((width) => (
        <div key={width} className="flex flex-col gap-2">
          <span className={`h-3 w-1/4 ${PULSE}`} />
          <span className={`h-7 ${width} rounded-control bg-soft motion-safe:animate-pulse`} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPair() {
  return (
    <div className="grid gap-3.5 sm:gap-5 xl:grid-cols-2">
      <SkeletonRows count={5} />
      <SkeletonRows count={5} />
    </div>
  );
}
