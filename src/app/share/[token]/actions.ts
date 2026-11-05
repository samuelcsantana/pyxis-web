'use server';

import type { ReactNode } from 'react';
import type { SharedRequest } from '@/domain/shared-project';
import { getI18n } from '@/i18n/get-messages';
import type { SharedAnswers } from '@/lib/shared-context';
import {
  type SharedScreenInput,
  sharedScreenRequests,
  sharedScreenView,
} from '@/lib/shared-screens';

export async function sharedRequestsAction(
  input: SharedScreenInput,
): Promise<readonly SharedRequest[]> {
  return sharedScreenRequests(input, await getI18n(), new Date());
}

export async function renderSharedAction(
  input: SharedScreenInput,
  answers: SharedAnswers,
): Promise<ReactNode> {
  return sharedScreenView(input, answers, await getI18n(), new Date());
}
