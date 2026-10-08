import type { StatusTone } from '@/domain/requests';

export const TONE_CLASSES: Readonly<Record<StatusTone, string>> = {
  success: 'bg-ok-soft text-ok',
  client: 'bg-warn-soft text-warn',
  server: 'bg-bad-soft text-bad',
};

const METHOD_CLASSES: Readonly<Record<string, string>> = {
  POST: 'bg-soft text-violet-ink',
  PUT: 'bg-soft text-sky-ink',
  PATCH: 'bg-soft text-sky-ink',
  DELETE: 'bg-bad-soft text-bad',
};
const OTHER_METHOD_CLASS = 'bg-soft text-ink';

export function methodClass(method: string): string {
  return METHOD_CLASSES[method] ?? OTHER_METHOD_CLASS;
}

export function MethodChip({ method }: { readonly method: string }) {
  return (
    <span
      className={`inline-block min-w-13.5 shrink-0 rounded-chip py-0.5 text-center font-mono text-micro font-semibold ${methodClass(method)}`}
    >
      {method}
    </span>
  );
}
