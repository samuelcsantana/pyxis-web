import { AvailableOnPro } from '@/components/account/available-on-pro';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import type { ShareLink } from '@/domain/share-links';
import type { I18n } from '@/i18n/i18n';
import type { CreateShareLink } from './create-share-link-form';
import type { RevokeShareLink } from './revoke-share-link-button';
import type { SetShareLinkPassword } from './share-link-password-control';
import { ShareLinksManager } from './share-links-manager';

export interface ShareLinksManagement {
  readonly links: readonly ShareLink[];
  readonly onPro: boolean;
  readonly create: CreateShareLink;
  readonly setPassword: SetShareLinkPassword;
  readonly revoke: RevokeShareLink;
}

export interface ShareLinksPanelProps extends ShareLinksManagement {
  readonly timezone: string;
  readonly i18n: I18n;
}

const NOTE = 'text-xs leading-[18px] text-muted';

export function ShareLinksPanel({
  links,
  onPro,
  create,
  setPassword,
  revoke,
  timezone,
  i18n,
}: ShareLinksPanelProps) {
  return (
    <section aria-labelledby="settings-share-links-heading" className={PANEL}>
      <h2 id="settings-share-links-heading" className={PANEL_TITLE}>
        {i18n.t('shareLinks.heading')}
      </h2>
      <p className={NOTE}>{i18n.t('shareLinks.note')}</p>
      <ShareLinksManager
        links={links}
        onPro={onPro}
        create={create}
        setPassword={setPassword}
        revoke={revoke}
        timezone={timezone}
        proOffer={<AvailableOnPro i18n={i18n} feature="public_share_link" viewer="owner" />}
      />
    </section>
  );
}
