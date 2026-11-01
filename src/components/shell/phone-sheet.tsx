'use client';

import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useId,
  useRef,
} from 'react';

export type SheetTone = 'nav' | 'card';

const SHEET =
  'fixed inset-x-0 top-auto bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] m-0 max-h-[calc(100dvh-7rem)] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-2xl border-0 border-t p-0 shadow-[0_-16px_40px_-16px_rgba(0,0,0,0.5)] backdrop:bg-[rgba(4,10,20,0.5)]';

const TONES: Readonly<Record<SheetTone, { readonly sheet: string; readonly title: string }>> = {
  nav: { sheet: 'border-nav-border bg-nav text-nav-text', title: 'text-nav-strong' },
  card: { sheet: 'border-line bg-card text-ink', title: 'text-ink' },
};

export interface PhoneSheetProps {
  readonly tone: SheetTone;
  readonly title: string;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

export function PhoneSheet({ tone, title, open, onClose, children }: PhoneSheetProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pressedOutside = useRef(false);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (element === null || element.open === open) {
      return;
    }
    if (open) {
      opener.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      element.showModal();
      return;
    }
    element.close();
    opener.current?.focus();
  }, [open]);

  const closeOnEscape = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };
  const notePress = (event: PointerEvent<HTMLDialogElement>) => {
    pressedOutside.current = event.target === event.currentTarget;
  };
  const closeOutside = (event: MouseEvent<HTMLDialogElement>) => {
    if (pressedOutside.current && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={closeOnEscape}
      onPointerDown={notePress}
      onClick={closeOutside}
      className={`${SHEET} ${TONES[tone].sheet}`}
    >
      <div className="flex flex-col gap-1 px-3 pt-3 pb-4">
        <h2 id={titleId} className={`px-2.5 pb-1 text-base font-semibold ${TONES[tone].title}`}>
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
