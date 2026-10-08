export interface StatCardProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly note: string;
}

export function StatCard({ id, label, value, note }: StatCardProps) {
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="flex flex-col gap-1.5 rounded-card border border-line bg-card px-3.5 py-3 text-ink sm:px-4.5 sm:py-4"
    >
      <h2 id={id} className="text-[13px] font-medium text-muted">
        {label}
      </h2>
      <p className="text-[22px] leading-7 font-semibold tracking-tight tabular-nums sm:text-[28px] sm:leading-8">
        {value}
      </p>
      <p className="text-xs text-muted">{note}</p>
    </div>
  );
}
