'use client';

import Link from 'next/link';
import { type ComponentProps, useState } from 'react';

export type IntentPrefetchLinkProps = Omit<
  ComponentProps<typeof Link>,
  'prefetch' | 'onPointerEnter' | 'onFocus'
>;

const POINTERS_WITHOUT_HOVER: ReadonlySet<string> = new Set(['touch']);

export function IntentPrefetchLink(props: IntentPrefetchLinkProps) {
  const [intent, setIntent] = useState(false);
  return (
    <Link
      {...props}
      prefetch={intent ? true : null}
      onPointerEnter={(event) => {
        if (!POINTERS_WITHOUT_HOVER.has(event.pointerType)) {
          setIntent(true);
        }
      }}
      onFocus={() => {
        setIntent(true);
      }}
    />
  );
}
