'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useRef,
} from 'react';
import { MENU_ID } from '@/components/shell/mobile-menu';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { type FrameView, FrameViewProvider, SECTION_TITLE, WINDOW_TITLE_ID } from './frame-view';

const CLOSE_ICON = 'M6 6l12 12 M18 6L6 18';
const ON_A_PHONE = 'max-lg:inset-0 max-lg:h-dvh max-lg:w-full';
const ON_A_LAPTOP =
  'lg:top-[clamp(1rem,6vh,4rem)] lg:left-1/2 lg:h-[min(44rem,calc(100dvh-clamp(1rem,6vh,4rem)-3.75rem))] lg:w-[min(50rem,calc(100vw-3rem))] lg:-translate-x-1/2 lg:rounded-2xl lg:border lg:border-line lg:shadow-[0_32px_80px_-24px_rgba(4,10,20,0.6),0_2px_6px_rgba(4,10,20,0.08)]';

const PHONE_WIDTH = '(width < 64rem)';

function focusInside(dialog: HTMLDialogElement, view: FrameView) {
  const onTheList = view === 'list' && window.matchMedia(PHONE_WIDTH).matches;
  dialog.querySelector<HTMLElement>(onTheList ? `#${WINDOW_TITLE_ID}` : SECTION_TITLE)?.focus();
}

interface Opener {
  readonly element: HTMLElement;
  readonly href: string | null;
}

function openerOf(active: Element | null): Opener | null {
  return active instanceof HTMLElement
    ? { element: active, href: active.getAttribute('href') }
    : null;
}

const MENU_TOGGLE = `[aria-controls="${MENU_ID}"]`;

function canTakeFocus(element: HTMLElement | null): element is HTMLElement {
  return (
    element !== null &&
    element.isConnected &&
    element !== document.body &&
    element.getClientRects().length > 0
  );
}

function sameLinkAs(opener: Opener): HTMLElement | null {
  return opener.href === null
    ? null
    : document.querySelector<HTMLElement>(`a[href="${CSS.escape(opener.href)}"]`);
}

function returnFocusTo(opener: Opener | null) {
  const candidates = opener === null ? [] : [opener.element, sameLinkAs(opener)];
  const target = [...candidates, document.querySelector<HTMLElement>(MENU_TOGGLE)].find(
    canTakeFocus,
  );
  target?.focus();
}

export interface SettingsDialogProps {
  readonly closeLabel: string;
  readonly initialView: FrameView;
  readonly children: ReactNode;
}

export function SettingsDialog({ closeLabel, initialView, children }: SettingsDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null as unknown as HTMLDialogElement);
  const closing = useRef(false);
  const opener = useRef<Opener | null>(null);
  const pressedOutside = useRef(false);
  const openedOn = useRef(initialView);

  useEffect(() => {
    opener.current ??= openerOf(document.activeElement);
    const returning = opener.current;
    dialog.current.showModal();
    focusInside(dialog.current, openedOn.current);
    return () => {
      returnFocusTo(returning);
    };
  }, []);

  const close = () => {
    if (closing.current) {
      return;
    }
    closing.current = true;
    router.back();
  };
  const closeOnEscape = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    close();
  };
  const notePress = (event: PointerEvent<HTMLDialogElement>) => {
    pressedOutside.current = event.target === event.currentTarget;
  };
  const closeOutside = (event: MouseEvent<HTMLDialogElement>) => {
    if (pressedOutside.current && event.target === event.currentTarget) {
      close();
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby={WINDOW_TITLE_ID}
      data-settings-window=""
      onCancel={closeOnEscape}
      onPointerDown={notePress}
      onClick={closeOutside}
      className={`fixed m-0 max-h-none max-w-none overflow-hidden border-0 bg-card p-0 text-ink backdrop:bg-[rgba(4,10,20,0.55)] open:flex ${ON_A_PHONE} ${ON_A_LAPTOP}`}
    >
      <FrameViewProvider initial={initialView} section={pathname}>
        {children}
      </FrameViewProvider>
      <button
        type="button"
        onClick={close}
        className={`absolute top-3.5 right-3.5 z-10 inline-flex size-11 items-center justify-center rounded-control text-muted hover:bg-soft hover:text-ink ${FOCUS_RING} ${CONTROL_TRANSITION}`}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={CLOSE_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">{closeLabel}</span>
      </button>
    </dialog>
  );
}
