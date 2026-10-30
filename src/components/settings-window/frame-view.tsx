'use client';

import Link from 'next/link';
import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PendingMark } from '@/components/ui/pending-mark';

export type FrameView = 'list' | 'section';
export type FrameMode = 'window' | 'page';

export const SECTION_TITLE = '[data-section-title]';
export const WINDOW_TITLE_ID = 'settings-window-title';
const CURRENT_ROW = '[data-frame-nav] [aria-current="page"]';

interface FrameViewState {
  readonly view: FrameView;
  readonly showList: () => void;
  readonly showSection: () => void;
}

const FrameViewContext = createContext<FrameViewState | null>(null);

export interface FrameViewProviderProps {
  readonly initial: FrameView;
  readonly section?: string;
  readonly children: ReactNode;
}

interface ViewChange {
  readonly view: FrameView;
  readonly focus: string | null;
}

export function FrameViewProvider({ initial, section, children }: FrameViewProviderProps) {
  const [change, setChange] = useState<ViewChange>({ view: initial, focus: null });
  const [shownSection, setShownSection] = useState(section);
  if (section !== shownSection) {
    setShownSection(section);
    setChange({ view: 'section', focus: SECTION_TITLE });
  }
  useEffect(() => {
    if (change.focus !== null) {
      document.querySelector<HTMLElement>(change.focus)?.focus();
    }
  }, [change]);
  const state = useMemo<FrameViewState>(
    () => ({
      view: change.view,
      showList: () => {
        setChange({ view: 'list', focus: CURRENT_ROW });
      },
      showSection: () => {
        setChange({ view: 'section', focus: SECTION_TITLE });
      },
    }),
    [change.view],
  );
  return <FrameViewContext value={state}>{children}</FrameViewContext>;
}

function useFrameView(): FrameViewState {
  const state = useContext(FrameViewContext);
  if (state === null) {
    throw new Error('A settings frame needs a FrameViewProvider above it.');
  }
  return state;
}

export interface FrameRootProps {
  readonly className: string;
  readonly children: ReactNode;
}

export function FrameRoot({ className, children }: FrameRootProps) {
  const { view } = useFrameView();
  return (
    <div data-view={view} className={`group/frame ${className}`}>
      {children}
    </div>
  );
}

export interface SectionLinkProps {
  readonly href: string;
  readonly mode: FrameMode;
  readonly current: boolean;
  readonly className: string;
  readonly children: ReactNode;
}

export function SectionLink({ href, mode, current, className, children }: SectionLinkProps) {
  const { showSection } = useFrameView();
  const stayOnTheSection = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showSection();
  };
  if (current) {
    return (
      <a href={href} aria-current="page" onClick={stayOnTheSection} className={className}>
        {children}
      </a>
    );
  }
  if (mode === 'page') {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} replace scroll={false} className={className}>
      {children}
      <PendingMark />
    </Link>
  );
}

export interface ShowListButtonProps {
  readonly className: string;
  readonly children: ReactNode;
}

export function ShowListButton({ className, children }: ShowListButtonProps) {
  const { showList } = useFrameView();
  return (
    <button type="button" onClick={showList} className={className}>
      {children}
    </button>
  );
}
