import type { ReactNode } from 'react';
import { LogoMark } from '@/components/brand/logo-mark';

export interface EmptyStateProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly headingLevel?: 'h1' | 'h2';
}

export function EmptyState({ title, children, headingLevel: Heading = 'h2' }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-start gap-3.5 rounded-card border border-line bg-card p-6 text-ink">
      <span className="flex size-11 items-center justify-center rounded-card bg-warn-soft">
        <LogoMark size={22} />
      </span>
      <Heading className="text-lg font-semibold">{title}</Heading>
      <div className="flex flex-col gap-3 text-sm leading-5 text-muted">{children}</div>
    </section>
  );
}
