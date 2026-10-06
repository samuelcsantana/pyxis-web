const BAR_HEIGHTS = ['40%', '65%', '50%', '80%', '58%', '72%', '46%'] as const;

export interface LoadingPanelProps {
  readonly label: string;
}

export function LoadingPanel({ label }: LoadingPanelProps) {
  return (
    <section
      aria-busy="true"
      aria-label={label}
      className="flex min-h-72 flex-col gap-4 rounded-card border border-line bg-card p-5"
    >
      <div className="grid grid-cols-2 gap-3">
        {['w-3/5', 'w-2/3'].map((width) => (
          <div key={width} className="flex flex-col gap-2.5 rounded-input border border-line p-3.5">
            <span className={`h-2.5 ${width} rounded-chip bg-grid motion-safe:animate-pulse`} />
            <span className="h-5 w-2/5 rounded-chip bg-grid motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
      <div className="flex grow items-end gap-2" aria-hidden="true">
        {BAR_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className="flex-1 rounded-t-chip bg-soft motion-safe:animate-pulse"
            style={{ height }}
          />
        ))}
      </div>
      <span className="text-sm text-muted">{label}…</span>
    </section>
  );
}
