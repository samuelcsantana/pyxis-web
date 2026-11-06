import { AvailableOnPro } from '@/components/account/available-on-pro';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import type { SlackWebhook } from '@/domain/slack-webhook';
import type { I18n } from '@/i18n/i18n';
import {
  type RemoveSlackWebhook,
  type SaveSlackWebhook,
  SlackWebhookManager,
  type TestSlackWebhook,
} from './slack-webhook-manager';

export interface SlackManagement {
  readonly webhook: SlackWebhook | null;
  readonly onPro: boolean;
  readonly save: SaveSlackWebhook;
  readonly test: TestSlackWebhook;
  readonly remove: RemoveSlackWebhook;
}

export interface SlackPanelProps extends SlackManagement {
  readonly timezone: string;
  readonly i18n: I18n;
}

export const SETTINGS_SLACK_PANEL = 'settings-slack';

export function SlackPanel({
  webhook,
  onPro,
  save,
  test,
  remove,
  timezone,
  i18n,
}: SlackPanelProps) {
  return (
    <section aria-labelledby={`${SETTINGS_SLACK_PANEL}-heading`} className={PANEL}>
      <h2 id={`${SETTINGS_SLACK_PANEL}-heading`} className={PANEL_TITLE}>
        {i18n.t('slack.heading')}
      </h2>
      <p className="text-xs leading-[18px] text-muted">{i18n.t('slack.note')}</p>
      <SlackWebhookManager
        initial={webhook}
        onPro={onPro}
        save={save}
        test={test}
        remove={remove}
        timezone={timezone}
        proOffer={<AvailableOnPro i18n={i18n} feature="slack_alerts" viewer="owner" />}
      />
    </section>
  );
}
