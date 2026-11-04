'use client';

import { lazy, type ReactNode, Suspense, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  closeTheMenuAround,
  focusReturnTargetOf,
  returnFocusTo,
} from '@/components/ui/focus-return';

const LanguageDialog = lazy(() =>
  import('./language-dialog').then((module) => ({ default: module.LanguageDialog })),
);

export interface LanguageDialogButtonProps {
  readonly choose: (form: FormData) => Promise<void>;
  readonly className: string;
  readonly children: ReactNode;
}

function preloadTheLanguageDialog() {
  void import('./language-dialog');
}

export function LanguageDialogButton({ choose, className, children }: LanguageDialogButtonProps) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onPointerEnter={preloadTheLanguageDialog}
        onFocus={preloadTheLanguageDialog}
        onClick={(event) => {
          opener.current = focusReturnTargetOf(event.currentTarget);
          closeTheMenuAround(event.currentTarget);
          setOpen(true);
        }}
        className={className}
      >
        {children}
      </button>
      {open
        ? createPortal(
            <Suspense fallback={null}>
              <LanguageDialog
                choose={choose}
                onClose={() => {
                  setOpen(false);
                  returnFocusTo(opener.current);
                }}
              />
            </Suspense>,
            document.body,
          )
        : null}
    </>
  );
}
