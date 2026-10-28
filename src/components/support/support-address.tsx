import { type CopyCodeLabels, CopyCodeButton } from '@/components/landing/copy-code-button';
import { SUPPORT_EMAIL } from '@/domain/accounts';

export interface SupportAddressProps {
  readonly id: string;
  readonly labels: CopyCodeLabels;
}

export function SupportAddress({ id, labels }: SupportAddressProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-card bg-nav py-2.5 pr-2.5 pl-4">
      <code id={id} className="min-w-0 font-mono text-sm wrap-anywhere text-nav-strong">
        {SUPPORT_EMAIL}
      </code>
      <CopyCodeButton placement="inline" code={SUPPORT_EMAIL} targetId={id} labels={labels} />
    </div>
  );
}
