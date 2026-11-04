'use client';

import { type MouseEvent, type SyntheticEvent, useEffect, useRef } from 'react';
import { BUTTON_SECONDARY, CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { returnFocusTo } from '@/components/ui/focus-return';
import { StrokeIcon } from '@/components/ui/stroke-icon';
import { useLocale, useT } from '@/i18n/messages-provider';
import { keepPageLinksInside } from './page-links';
import { SectionNav } from './section-nav';
import { forgetSettingsContent } from './settings-content-cache';
import {
  closeSettings,
  forgetHowSettingsOpened,
  showSettingsList,
  takeTheSettingsOpener,
  useAddressBarShowingSettings,
  useSettingsLocation,
} from './settings-location';
import { FIRST_SECTION } from './settings-sections';
import { type LoadSettingsContent, useSettingsContent } from './use-settings-content';

export interface SettingsDialogProps {
  readonly projectId: string;
  readonly projectName: string;
  readonly loadContent?: LoadSettingsContent;
}

const TITLE_ID = 'settings-dialog-title';
const CLOSE_ICON = 'M6 6l12 12 M18 6L6 18';
const BACK_ICON = 'M15 6l-6 6 6 6';
const DIALOG = [
  'fixed inset-0 m-auto h-dvh max-h-none w-screen max-w-none overflow-hidden bg-bg p-0 text-ink',
  'backdrop:bg-black/50 open:flex open:flex-col',
  'sm:h-[min(48rem,calc(100dvh-3rem))] sm:w-[min(68rem,calc(100vw-3rem))]',
  'sm:rounded-panel sm:border sm:border-line sm:shadow-2xl',
  'sm:[@media(max-height:32rem)]:h-dvh sm:[@media(max-height:32rem)]:w-screen',
  'sm:[@media(max-height:32rem)]:rounded-none sm:[@media(max-height:32rem)]:border-0',
].join(' ');
const FLAT_PANELS = [
  '[&>div]:gap-0!',
  '[&>div>section]:rounded-none [&>div>section]:border-0 [&>div>section]:bg-transparent [&>div>section]:p-0!',
  '[&>div>section+section]:mt-7 [&>div>section+section]:border-t! [&>div>section+section]:pt-7!',
].join(' ');
const ICON_BUTTON = `flex size-11 shrink-0 items-center justify-center rounded-input text-muted hover:bg-soft hover:text-ink active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const PULSE = 'animate-pulse rounded-pill bg-soft motion-reduce:animate-none';
const PLACEHOLDER_BLOCKS = [0, 1] as const;

function Placeholder() {
  const t = useT();
  return (
    <div role="status" className="flex flex-col gap-4">
      <span className="sr-only">{t('settingsDialog.loading')}</span>
      {PLACEHOLDER_BLOCKS.map((block) => (
        <div key={block} aria-hidden="true" className="flex flex-col gap-3 py-2">
          <span className={`h-4 w-1/3 ${PULSE}`} />
          <span className={`h-3 w-2/3 ${PULSE}`} />
          <span className={`h-3 w-1/2 ${PULSE}`} />
        </div>
      ))}
    </div>
  );
}

function Failed({ retry }: { readonly retry: () => void }) {
  const t = useT();
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p className="text-sm">{t('settingsDialog.failed')}</p>
      <button
        type="button"
        onClick={retry}
        className={`min-h-11 rounded-input px-3.5 text-sm ${BUTTON_SECONDARY}`}
      >
        {t('settingsDialog.retry')}
      </button>
    </div>
  );
}

function useOpenAsAModal(open: boolean) {
  const dialog = useRef<HTMLDialogElement>(null as unknown as HTMLDialogElement);
  useEffect(() => {
    const element = dialog.current;
    if (open) {
      element.showModal();
      return;
    }
    if (element.open) {
      element.close();
      returnFocusTo(takeTheSettingsOpener());
    }
    forgetHowSettingsOpened();
    forgetSettingsContent();
  }, [open]);
  return dialog;
}

function useClosingInPlaceAfterALanguageChange() {
  const locale = useLocale();
  const openedIn = useRef(locale);
  useEffect(() => {
    if (openedIn.current !== locale) {
      openedIn.current = locale;
      forgetHowSettingsOpened();
    }
  }, [locale]);
}

function closeOnEscape(event: SyntheticEvent<HTMLDialogElement>) {
  event.preventDefault();
  closeSettings();
}

function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target === event.currentTarget) {
    closeSettings();
  }
}

export function SettingsDialog({ projectId, projectName, loadContent }: SettingsDialogProps) {
  const t = useT();
  const location = useSettingsLocation();
  useAddressBarShowingSettings();
  useClosingInPlaceAfterALanguageChange();
  const open = location.kind !== 'closed';
  const dialog = useOpenAsAModal(open);
  const content = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const [loaded, retry] = useSettingsContent(projectId, open, loadContent);
  const listOnly = location.kind === 'list';
  const section = location.kind === 'section' ? location.section : FIRST_SECTION;
  const sectionName = t(`settingsDialog.sections.${section}`);

  useEffect(() => {
    content.current.scrollTop = 0;
  }, [section]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={TITLE_ID}
      onCancel={closeOnEscape}
      onClick={closeOnBackdrop}
      className={DIALOG}
    >
      <header className="flex min-h-14 shrink-0 items-center gap-1 border-b border-line bg-card px-2 sm:min-h-16 sm:px-4">
        {listOnly ? null : (
          <button type="button" onClick={showSettingsList} className={`${ICON_BUTTON} sm:hidden`}>
            <StrokeIcon path={BACK_ICON} size={20} />
            <span className="sr-only">{t('settingsDialog.back')}</span>
          </button>
        )}
        <h2
          id={TITLE_ID}
          className={`min-w-0 flex-1 px-2 text-base font-semibold sm:px-1 sm:text-lg ${listOnly ? '' : 'max-sm:hidden'}`}
        >
          {t('settingsDialog.title')}
        </h2>
        {listOnly ? null : (
          <p
            aria-hidden="true"
            className="min-w-0 flex-1 text-base font-semibold wrap-anywhere sm:hidden"
          >
            {sectionName}
          </p>
        )}
        <button type="button" onClick={closeSettings} className={ICON_BUTTON} autoFocus>
          <StrokeIcon path={CLOSE_ICON} size={20} />
          <span className="sr-only">{t('settingsDialog.close')}</span>
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <div
          className={`shrink-0 overflow-y-auto overscroll-contain border-line p-3 sm:w-60 sm:border-r sm:bg-card ${listOnly ? 'max-sm:w-full' : 'max-sm:hidden'}`}
        >
          <SectionNav
            current={listOnly ? null : section}
            available={loaded.kind === 'ready' ? loaded.value.sections : null}
            projectName={projectName}
          />
        </div>
        <div
          ref={content}
          onClickCapture={keepPageLinksInside(projectId)}
          className={`min-w-0 flex-1 overflow-y-auto overscroll-contain bg-card p-4 sm:px-8 sm:py-7 ${listOnly ? 'max-sm:hidden' : ''}`}
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <h3 className="sr-only">{sectionName}</h3>
            {loaded.kind === 'loading' ? <Placeholder /> : null}
            {loaded.kind === 'failed' ? <Failed retry={retry} /> : null}
            {loaded.kind === 'ready' ? (
              <div className={FLAT_PANELS}>{loaded.value.content[section]}</div>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>
  );
}
