import { OpenSettingsButton } from '@/components/settings-dialog/open-settings-button';
import { TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';

export interface NoGoalsProps {
  readonly projectId: string;
  readonly i18n: I18n;
}

export function NoGoals({ projectId, i18n }: NoGoalsProps) {
  return (
    <p className="text-caption leading-5 text-muted">
      {rich(i18n.t('goals.none'), {
        settings: (text) => (
          <OpenSettingsButton projectId={projectId} section="goals" className={TEXT_LINK}>
            {text}
          </OpenSettingsButton>
        ),
      })}
    </p>
  );
}
