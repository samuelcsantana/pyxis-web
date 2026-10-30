import type { ReactNode } from 'react';

export const NOTE = 'text-xs leading-[18px] text-muted';
export const CODE = 'font-mono text-sm';
export const SUBHEADING = 'text-sm font-semibold';
export const ITEM_LIST = 'flex flex-col gap-1.5';
export const PART_STACK = 'flex flex-col gap-4 [&>*+*]:border-t [&>*+*]:border-line [&>*+*]:pt-4';

const TERM = 'text-xs font-medium text-muted';
const DEFINITION = 'text-sm text-ink wrap-anywhere';

export interface SubSectionProps {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
}

export function SubSection({ id, title, children }: SubSectionProps) {
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-2">
      <h3 id={id} className={SUBHEADING}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export interface FieldProps {
  readonly term: string;
  readonly children: ReactNode;
}

export function Field({ term, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={TERM}>{term}</dt>
      <dd className={DEFINITION}>{children}</dd>
    </div>
  );
}

export type When = (iso: string) => string;
