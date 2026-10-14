import type { ReactNode } from 'react';
import { LANDING_WIDTH, REVEAL } from './landing-classes';

export interface EyebrowProps {
  readonly children: ReactNode;
}

export function Eyebrow({ children }: EyebrowProps) {
  return (
    <p className="flex items-center gap-2 font-mono text-caption font-medium tracking-[0.08em] text-muted uppercase">
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-pill bg-accent" />
      {children}
    </p>
  );
}

export interface LandingSectionProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
  readonly children: ReactNode;
}

export function LandingSection({ id, eyebrow, title, lead, children }: LandingSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="scroll-mt-16 border-t border-line py-16 lg:py-22"
    >
      <div className={LANDING_WIDTH}>
        <div className={`mb-9 flex max-w-2xl flex-col gap-3 ${REVEAL}`}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id={titleId}
            className="text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance wrap-break-word hyphens-auto lg:text-4xl"
          >
            {title}
          </h2>
          {lead === undefined ? null : (
            <p className="text-lg leading-relaxed text-pretty text-muted">{lead}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
