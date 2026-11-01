'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { useProjectChoices } from './project-choices';
import { hrefKeepingView, projectSectionHref } from './screens';

type Copying =
  | { readonly state: 'idle' }
  | { readonly state: 'copied' }
  | { readonly state: 'refused'; readonly link: string };

export const LINK_COPIED_SHOWN_MS = 4000;

const IDLE: Copying = { state: 'idle' };
const COPIED: Copying = { state: 'copied' };
const LINK_ICON =
  'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1';
const CHECK_ICON = 'M5 12.5l4.5 4.5L19 7.5';
const DOWNLOAD_ICON = 'M12 4v11 M7 10l5 5 5-5 M5 20h14';
const ACTION = `inline-flex size-10 shrink-0 items-center justify-center rounded-input border border-line bg-card text-ink hover:border-muted hover:bg-soft active:border-muted active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const BELOW = 'absolute top-full right-0 z-20 mt-1.5';
const BUBBLE = `${BELOW} rounded-control bg-ink px-2.5 py-1 text-caption whitespace-nowrap text-card`;
const LINK_FIELD = `${BELOW} w-80 rounded-input border border-field bg-card px-3 py-2 text-sm text-ink shadow-lg ${FOCUS_RING}`;

function ActionIcon({ path }: { readonly path: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function selectAll(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

function CopyLinkButton() {
  const t = useT();
  const button = useRef<HTMLButtonElement>(null);
  const [copying, setCopying] = useState<Copying>(IDLE);

  useEffect(() => {
    if (copying.state !== 'copied') {
      return undefined;
    }
    const timer = setTimeout(() => {
      setCopying(IDLE);
    }, LINK_COPIED_SHOWN_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [copying]);

  const copy = () => {
    const link = window.location.href;
    setCopying(IDLE);
    void Promise.resolve()
      .then(() => navigator.clipboard.writeText(link))
      .then(
        () => {
          setCopying(COPIED);
        },
        () => {
          setCopying({ state: 'refused', link });
        },
      );
  };

  const closeOnEscape = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setCopying(IDLE);
      button.current?.focus();
    }
  };

  const copied = copying.state === 'copied';
  return (
    <span className="relative">
      <button
        ref={button}
        type="button"
        onClick={copy}
        title={t('nav.copyLinkHint')}
        className={ACTION}
      >
        <ActionIcon path={copied ? CHECK_ICON : LINK_ICON} />
        <span className="sr-only">{t('nav.copyLink')}</span>
      </button>
      <span aria-live="polite" className={copied ? BUBBLE : 'sr-only'}>
        {copied ? t('nav.linkCopied') : ''}
      </span>
      {copying.state === 'refused' ? (
        <input
          ref={selectAll}
          readOnly
          value={copying.link}
          aria-label={t('nav.copyLink')}
          onKeyDown={closeOnEscape}
          onBlur={() => {
            setCopying(IDLE);
          }}
          className={LINK_FIELD}
        />
      ) : null}
    </span>
  );
}

function ExportLink({ projectId }: { readonly projectId: string }) {
  const t = useT();
  const search = useSearchParams();
  return (
    <Link
      href={hrefKeepingView(projectSectionHref(projectId, 'export'), search)}
      scroll={false}
      title={t('nav.exportHint')}
      className={ACTION}
    >
      <ActionIcon path={DOWNLOAD_ICON} />
      <span className="sr-only">{t('nav.export')}</span>
    </Link>
  );
}

export interface BarActionsProps {
  readonly projectId: string;
}

export function BarActions({ projectId }: BarActionsProps) {
  const { ownsCurrentProject } = useProjectChoices();
  return (
    <>
      <CopyLinkButton />
      {ownsCurrentProject ? <ExportLink projectId={projectId} /> : null}
    </>
  );
}
