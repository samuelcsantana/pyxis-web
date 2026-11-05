import type { ReactNode } from 'react';
import {
  isSharedScreen,
  isShareToken,
  type SharedRequest,
  type SharedScreen,
} from '@/domain/shared-project';
import { sharedProjectResponseSchema } from '@/domain/shared-project.schema';
import { SharedTopbar } from '@/components/share/shared-topbar';
import { SCREEN_WIDTH } from '@/components/shell/screen-width';
import type { I18n } from '@/i18n/i18n';
import type { ScreenSearch } from '@/components/shell/screen-search';
import { sharedAcquisitionRequests, sharedAcquisitionView } from './shared-acquisition';
import { sharedDevicesRequests, sharedDevicesView } from './shared-devices';
import { sharedFeaturesRequests, sharedFeaturesView } from './shared-features';
import { sharedFunnelRequests, sharedFunnelView } from './shared-funnel';
import type { SharedAnswers, SharedContext } from './shared-context';
import { sharedOverviewRequests, sharedOverviewView } from './shared-overview';

export interface SharedScreenInput {
  readonly token: string;
  readonly screen: string;
  readonly card: unknown;
  readonly search: ScreenSearch;
}

interface SharedScreenDefinition {
  readonly requests: (context: SharedContext) => readonly SharedRequest[];
  readonly view: (context: SharedContext, answers: SharedAnswers) => ReactNode;
}

const DEFINITIONS: Readonly<Record<SharedScreen, SharedScreenDefinition>> = {
  overview: { requests: sharedOverviewRequests, view: sharedOverviewView },
  acquisition: { requests: sharedAcquisitionRequests, view: sharedAcquisitionView },
  devices: { requests: sharedDevicesRequests, view: sharedDevicesView },
  features: { requests: sharedFeaturesRequests, view: sharedFeaturesView },
  funnel: { requests: sharedFunnelRequests, view: sharedFunnelView },
};

function sharedScreenOf(value: string): SharedScreen {
  if (!isSharedScreen(value)) {
    throw new Error(`No shared screen is called ${value}.`);
  }
  return value;
}

function contextOf(input: SharedScreenInput, i18n: I18n, now: Date): SharedContext {
  if (!isShareToken(input.token)) {
    throw new Error('A shared screen needs a share token.');
  }
  return {
    token: input.token,
    project: sharedProjectResponseSchema.parse(input.card),
    search: input.search,
    i18n,
    now,
  };
}

export function sharedScreenRequests(
  input: SharedScreenInput,
  i18n: I18n,
  now: Date,
): readonly SharedRequest[] {
  return DEFINITIONS[sharedScreenOf(input.screen)].requests(contextOf(input, i18n, now));
}

export function sharedScreenView(
  input: SharedScreenInput,
  answers: SharedAnswers,
  i18n: I18n,
  now: Date,
): ReactNode {
  const screen = sharedScreenOf(input.screen);
  const context = contextOf(input, i18n, now);
  return (
    <>
      <SharedTopbar
        token={context.token}
        screen={screen}
        projectName={context.project.name}
        timeZone={context.project.timezone}
        serverNow={now.getTime()}
      />
      <div
        className={`flex ${SCREEN_WIDTH} flex-col gap-3.5 p-4 sm:gap-6 sm:px-8 sm:pt-7 sm:pb-12`}
      >
        {DEFINITIONS[screen].view(context, answers)}
      </div>
    </>
  );
}
