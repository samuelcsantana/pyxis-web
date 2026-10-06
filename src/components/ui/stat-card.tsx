export interface StatCardProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly note: string;
}

export function StatCard({ id, label, value, note }: StatCardProps) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-1.5 rounded-card border border-line bg-card px-4.5 py-4 text-ink"
    >
      <h2 id={id} className="text-[13px] font-medium text-muted">
        {label}
      </h2>
      <p className="text-[28px] leading-8 font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="text-xs text-muted">{note}</p>
    </section>
  );
}
