'use client';

import { type ReactNode, useState } from 'react';
import { Breakable } from '@/components/ui/breakable';
import {
  canCreateShareLink,
  type ShareLink,
  type ShareLinkValidity,
  shareLinkValidity,
} from '@/domain/share-links';
import { dateTimeFormat } from '@/i18n/date-time-formats';
import { displayTag } from '@/i18n/display-tag';
import { useLocale, useT } from '@/i18n/messages-provider';
import { type CreateShareLink, CreateShareLinkForm } from './create-share-link-form';
import { type RevokeShareLink, RevokeShareLinkButton } from './revoke-share-link-button';

export interface ShareLinksManagerProps {
  readonly links: readonly ShareLink[];
  readonly onPro: boolean;
  readonly create: CreateShareLink;
  readonly revoke: RevokeShareLink;
  readonly timezone: string;
  readonly proOffer: ReactNode;
}

const ROW = 'flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0';
const DETAIL = 'text-xs leading-[18px] text-muted';

export function shareLinkNameId(linkId: string): string {
  return `share-link-name-${linkId}`;
}

export function ShareLinksManager({
  links: initial,
  onPro,
  create,
  revoke,
  timezone,
  proOffer,
}: ShareLinksManagerProps) {
  const t = useT();
  const locale = useLocale();
  const [links, setLinks] = useState(initial);
  const [now] = useState(() => new Date());
  const format = dateTimeFormat(displayTag(locale), 'eventTime', timezone);
  const when = (iso: string) => format(new Date(iso));

  const validityText = (validity: ShareLinkValidity): string => {
    switch (validity.kind) {
      case 'forever':
        return t('shareLinks.neverExpires');
      case 'until':
        return t('shareLinks.expiresOn', { when: when(validity.at) });
      case 'expired':
        return t('shareLinks.expiredOn', { when: when(validity.at) });
    }
  };

  return (
    <>
      {onPro ? (
        <CreateShareLinkForm
          create={create}
          limitReached={!canCreateShareLink(links)}
          onCreated={(link) => {
            setLinks((current) => [...current, link]);
          }}
        />
      ) : (
        proOffer
      )}
      {links.length === 0 ? (
        <p className="text-sm text-muted">{t('shareLinks.empty')}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line border-t border-line pt-3">
          {links.map((link) => {
            const nameId = shareLinkNameId(link.id);
            const validity = shareLinkValidity(link, now);
            return (
              <li key={link.id} className={ROW}>
                <div className="flex min-w-0 flex-col gap-1">
                  <span id={nameId} className="text-sm font-semibold text-ink">
                    <Breakable text={link.name} />
                  </span>
                  <p className={DETAIL}>
                    {t('shareLinks.createdOn', { when: when(link.createdAt) })}
                    {' · '}
                    <span
                      className={validity.kind === 'expired' ? 'font-medium text-bad' : undefined}
                    >
                      {validityText(validity)}
                    </span>
                  </p>
                </div>
                <RevokeShareLinkButton
                  linkId={link.id}
                  name={link.name}
                  describedBy={nameId}
                  revoke={revoke}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
