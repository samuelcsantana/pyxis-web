'use client';

import { useEffect, useState } from 'react';
import { createI18n } from '@/i18n/i18n';
import { loadMessages } from '@/i18n/load-messages';
import type { Locale } from '@/i18n/locales';
import { useLocale } from '@/i18n/messages-provider';
import { settingsContentOf } from './settings-content-cache';
import { type SettingsDialogContent, settingsDialogContentOf } from './settings-section-content';

export type SettingsContent =
  | { readonly kind: 'loading' }
  | { readonly kind: 'failed' }
  | { readonly kind: 'ready'; readonly value: SettingsDialogContent };

const LOADING: SettingsContent = { kind: 'loading' };
const FAILED: SettingsContent = { kind: 'failed' };

export type LoadSettingsContent = (
  projectId: string,
  locale: Locale,
) => Promise<SettingsDialogContent>;

export async function loadSettingsContent(
  projectId: string,
  locale: Locale,
): Promise<SettingsDialogContent> {
  const [data, messages] = await Promise.all([
    settingsContentOf(projectId, locale),
    loadMessages(locale),
  ]);
  return settingsDialogContentOf(data, createI18n(locale, messages));
}

export function useSettingsContent(
  projectId: string,
  open: boolean,
  load: LoadSettingsContent = loadSettingsContent,
): readonly [SettingsContent, () => void] {
  const locale = useLocale();
  const [content, setContent] = useState<SettingsContent>(LOADING);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!open) {
      return;
    }
    let wanted = true;
    load(projectId, locale).then(
      (value) => {
        if (wanted) {
          setContent({ kind: 'ready', value });
        }
      },
      () => {
        if (wanted) {
          setContent(FAILED);
        }
      },
    );
    return () => {
      wanted = false;
    };
  }, [projectId, locale, open, attempt, load]);
  const retry = () => {
    setContent(LOADING);
    setAttempt((count) => count + 1);
  };
  return [content, retry];
}
