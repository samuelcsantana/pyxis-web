'use client';

import { type SyntheticEvent, useId, useState } from 'react';
import { CONTROL_TRANSITION, FIELD, FOCUS_RING } from '@/components/ui/control-classes';
import { StrokeIcon } from '@/components/ui/stroke-icon';
import { useChoiceAhead } from '@/components/ui/use-choice-ahead';
import { type Locale, LOCALES, localeName } from '@/i18n/locales';
import { useLocale, useT } from '@/i18n/messages-provider';
import { LocaleFlag } from './locale-flag';
import { useRevealWhenTheLanguageArrives } from './use-reveal-when-the-language-arrives';

const SEARCH_ICON = 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4';
const CLOSE_ICON = 'M6 6l12 12 M18 6L6 18';
const CHECK_ICON = 'M5 12.5l4.5 4.5L19 7.5';
const ENGLISH: Locale = 'en';
const ICON_STROKE = 2;
const SPOKEN_SEPARATOR = ', ';
const DIACRITICS = /\p{Diacritic}/gu;

function folded(text: string): string {
  return text.normalize('NFD').replace(DIACRITICS, '').toLocaleLowerCase();
}

function nameIn(shownIn: Locale, locale: Locale): string {
  const name = String(new Intl.DisplayNames([shownIn], { type: 'language' }).of(locale));
  return `${name.charAt(0).toLocaleUpperCase(shownIn)}${name.slice(1)}`;
}

function matches(locale: Locale, uiLocale: Locale, query: string): boolean {
  const wanted = folded(query.trim());
  if (wanted === '') {
    return true;
  }
  const names = [localeName(locale), nameIn(uiLocale, locale), nameIn(ENGLISH, locale), locale];
  return names.some((name) => folded(name).includes(wanted));
}

function keepInside(event: SyntheticEvent) {
  event.stopPropagation();
}

export interface LanguageDialogProps {
  readonly choose: (form: FormData) => Promise<void>;
  readonly onClose: () => void;
}

export function LanguageDialog({ choose, onClose }: LanguageDialogProps) {
  const t = useT();
  const uiLocale = useLocale();
  const titleId = useId();
  const choicesId = useId();
  const [query, setQuery] = useState('');
  const [shown, chooseAhead] = useChoiceAhead(uiLocale);
  const found = LOCALES.filter((locale) => matches(locale, uiLocale, query));
  useRevealWhenTheLanguageArrives(uiLocale);

  const close = (dialog: HTMLDialogElement | null) => {
    dialog?.close();
  };

  return (
    <dialog
      ref={(dialog) => {
        if (dialog !== null && !dialog.open) {
          dialog.showModal();
          dialog.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
        }
      }}
      aria-labelledby={titleId}
      onClose={(event) => {
        keepInside(event);
        onClose();
      }}
      onCancel={keepInside}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          keepInside(event);
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          close(event.currentTarget);
        }
      }}
      className="fixed inset-0 m-auto h-[min(34rem,calc(100dvh-4rem))] max-h-none w-[min(26rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-panel border border-line bg-card p-0 text-ink shadow-2xl backdrop:bg-black/50 open:flex open:flex-col"
    >
      <header className="flex shrink-0 items-center gap-2 px-4 pt-4 pb-3">
        <h2 id={titleId} className="min-w-0 flex-1 text-base font-semibold">
          {t('settingsDialog.languageDialog.title')}
        </h2>
        <button
          type="button"
          onClick={(event) => {
            close(event.currentTarget.closest('dialog'));
          }}
          className={`flex size-11 items-center justify-center rounded-input text-muted hover:bg-soft hover:text-ink active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION}`}
        >
          <StrokeIcon path={CLOSE_ICON} size={18} strokeWidth={ICON_STROKE} />
          <span className="sr-only">{t('settingsDialog.languageDialog.close')}</span>
        </button>
      </header>
      <div className="shrink-0 px-4 pb-3">
        <label className="relative flex items-center">
          <span className="pointer-events-none absolute left-3 text-muted">
            <StrokeIcon path={SEARCH_ICON} size={16} strokeWidth={ICON_STROKE} />
          </span>
          <span className="sr-only">{t('settingsDialog.languageDialog.search')}</span>
          <input
            type="search"
            value={query}
            placeholder={t('settingsDialog.languageDialog.search')}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onKeyDown={(event) => {
              const first = found[0];
              if (event.key !== 'Enter' || first === undefined) {
                return;
              }
              event.preventDefault();
              event.currentTarget.form?.requestSubmit(
                event.currentTarget.form.querySelector<HTMLButtonElement>(
                  `button[value="${first}"]`,
                ),
              );
            }}
            className={`h-10 w-full rounded-input pr-3 pl-9 text-sm ${FIELD}`}
            form={choicesId}
          />
        </label>
      </div>
      <form
        id={choicesId}
        action={choose}
        onSubmit={(event) => {
          close(event.currentTarget.closest('dialog'));
        }}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-line p-2"
      >
        {found.length === 0 ? (
          <p role="status" className="px-3 py-6 text-center text-sm text-muted">
            {t('settingsDialog.languageDialog.noMatch', { query: query.trim() })}
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {found.map((locale) => {
              const current = locale === shown;
              const translated = nameIn(uiLocale, locale);
              return (
                <li key={locale}>
                  <button
                    type="submit"
                    name="locale"
                    value={locale}
                    aria-pressed={current}
                    onClick={() => {
                      chooseAhead(locale);
                    }}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-control px-3 text-left hover:bg-soft active:bg-line ${current ? 'bg-soft' : ''} ${FOCUS_RING} ${CONTROL_TRANSITION}`}
                  >
                    <LocaleFlag locale={locale} />
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span lang={locale} className={`text-sm ${current ? 'font-semibold' : ''}`}>
                        {localeName(locale)}
                      </span>
                      {translated === localeName(locale) ? null : (
                        <span className="text-xs text-muted">
                          <span className="sr-only">{SPOKEN_SEPARATOR}</span>
                          {translated}
                        </span>
                      )}
                    </span>
                    <span className={`text-accent ${current ? '' : 'invisible'}`}>
                      <StrokeIcon path={CHECK_ICON} size={18} strokeWidth={ICON_STROKE} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </form>
    </dialog>
  );
}
