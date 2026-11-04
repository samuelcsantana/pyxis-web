import { LanguageDialogButton } from '@/components/language/language-dialog-button';
import { OpenSettingsButton } from '@/components/settings-dialog/open-settings-button';
import { NAV_CONTROL, NAV_ITEM_IDLE } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { StrokeIcon } from '@/components/ui/stroke-icon';
import { QUOTA_WARNING_RATIO } from '@/domain/accounts';
import { emailInitial } from '@/domain/admin';
import type { I18n } from '@/i18n/i18n';
import type { MonthUsage, PlanBadge } from '@/lib/accounts-in-view';
import { SignOutButton } from './sign-out-button';

export interface AccountPanelMenuProps {
  readonly projectId: string;
  readonly email: string;
  readonly plan: PlanBadge | null;
  readonly i18n: I18n;
  readonly chooseLocale: (form: FormData) => Promise<void>;
  readonly usage?: MonthUsage | null;
}

const DOWN = 'M6 9l6 6 6-6';
const HELP =
  'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4 M12 16.8v.2';
const GEAR =
  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z';
const GLOBE =
  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9 M12 3C9.5 5.5 8.2 8.5 8.2 12s1.3 6.5 3.8 9';

const ROW = `flex min-h-11 w-full items-center gap-2.5 rounded-control px-2 text-caption ${NAV_ITEM_IDLE} ${NAV_CONTROL}`;
const LINE = 'my-1 border-t border-nav-line';
const FULL_BAR = 1;

const ICON_SIZE_PX = 16;

function Icon({
  path,
  className = 'text-nav-muted',
}: {
  readonly path: string;
  readonly className?: string;
}) {
  return <StrokeIcon path={path} size={ICON_SIZE_PX} className={className} />;
}

function nameOf(email: string): string {
  return email.split('@', 1).join('');
}

function whenTheCountResumes(usage: MonthUsage, i18n: I18n): string {
  if (usage.pausedUntil === null) {
    return i18n.t('nav.usage.resets', { date: i18n.format.day(new Date(usage.resetsOn)) });
  }
  return i18n.t('account.notice.paused', { date: i18n.format.day(new Date(usage.pausedUntil)) });
}

function usageTone(usage: MonthUsage): string {
  if (usage.pausedUntil !== null) {
    return 'bg-nav-bad';
  }
  return usage.share >= QUOTA_WARNING_RATIO ? 'bg-nav-warn' : 'bg-accent';
}

interface UsageRowProps {
  readonly projectId: string;
  readonly usage: MonthUsage;
  readonly i18n: I18n;
}

function UsageRow({ projectId, usage, i18n }: UsageRowProps) {
  const filled = Math.min(usage.share, FULL_BAR) * 100;
  return (
    <OpenSettingsButton
      projectId={projectId}
      section="billing"
      className={`flex flex-col gap-1.5 rounded-control px-2 py-2 text-caption ${NAV_ITEM_IDLE} ${NAV_CONTROL}`}
    >
      <span className="sr-only">{`${i18n.t('settingsDialog.menu.plan')}: `}</span>
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-nav-strong">
          {i18n.t('nav.usage.events', {
            count: i18n.format.count(usage.events),
            limit: i18n.format.count(usage.limit),
          })}
        </span>
        <span className="shrink-0 text-micro tabular-nums">
          {i18n.format.wholePercent(usage.share)}
        </span>
      </span>
      <span aria-hidden="true" className="h-1 overflow-hidden rounded-pill bg-nav-border">
        <span
          className={`block h-full rounded-pill ${usageTone(usage)}`}
          style={{ width: `${String(filled)}%` }}
        />
      </span>
      <span className="text-micro">{whenTheCountResumes(usage, i18n)}</span>
    </OpenSettingsButton>
  );
}

export function AccountPanelMenu({
  projectId,
  email,
  plan,
  i18n,
  chooseLocale,
  usage = null,
}: AccountPanelMenuProps) {
  return (
    <div className="relative flex items-center gap-1">
      <DismissableDetails className="group min-w-0 flex-1">
        <summary
          className={`flex min-h-11 min-w-0 list-none items-center gap-2 rounded-input px-1.5 py-1 hover:bg-nav-hover active:bg-nav-active group-open:bg-nav-active ${NAV_CONTROL} [&::-webkit-details-marker]:hidden`}
        >
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-nav-border text-micro font-semibold text-nav-strong"
          >
            {emailInitial(email)}
          </span>
          <span className="sr-only">{i18n.t('settingsDialog.menu.open')}</span>
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-1 text-sm">
            <span className="font-medium wrap-anywhere text-nav-strong">{nameOf(email)}</span>
            {plan === null ? null : (
              <span className="text-nav-text">{`· ${i18n.t(`settingsDialog.plan.${plan}`)}`}</span>
            )}
          </span>
          <Icon
            path={DOWN}
            className="text-accent transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <div className="absolute right-0 bottom-full left-0 z-10 mb-2 flex flex-col rounded-input border border-nav-border bg-nav-raised p-1.5 shadow-lg lg:max-h-[calc(100dvh-5rem)] lg:overflow-y-auto lg:overscroll-contain">
          <p className="px-2 pt-1.5 pb-1 text-micro wrap-anywhere text-nav-muted">{email}</p>
          <OpenSettingsButton projectId={projectId} section="general" className={ROW}>
            <Icon path={GEAR} />
            <span>{i18n.t('settingsDialog.menu.settings')}</span>
          </OpenSettingsButton>
          <LanguageDialogButton choose={chooseLocale} className={ROW}>
            <Icon path={GLOBE} />
            <span>{i18n.t('settingsDialog.menu.language')}</span>
          </LanguageDialogButton>
          <OpenSettingsButton projectId={projectId} section="help" className={ROW}>
            <Icon path={HELP} />
            <span>{i18n.t('settingsDialog.menu.help')}</span>
          </OpenSettingsButton>
          {usage === null ? null : (
            <>
              <div className={LINE} />
              <UsageRow projectId={projectId} usage={usage} i18n={i18n} />
            </>
          )}
          <div className={LINE} />
          <div className="flex flex-col [&_button]:w-full [&_button]:px-2">
            <SignOutButton />
          </div>
        </div>
      </DismissableDetails>
      <OpenSettingsButton
        projectId={projectId}
        section="general"
        className={`flex size-11 shrink-0 items-center justify-center rounded-input text-nav-text hover:bg-nav-hover hover:text-nav-strong active:bg-nav-active ${NAV_CONTROL}`}
      >
        <Icon path={GEAR} className="text-current" />
        <span className="sr-only">{i18n.t('settingsDialog.menu.settings')}</span>
      </OpenSettingsButton>
    </div>
  );
}
