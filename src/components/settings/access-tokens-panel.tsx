import { Breakable } from '@/components/ui/breakable';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { type AccessToken, canCreateAccessToken } from '@/domain/access-tokens';
import type { I18n } from '@/i18n/i18n';
import { type CreateAccessToken, CreateAccessTokenForm } from './create-access-token-form';
import { type Revoke, RevokeButton } from './revoke-button';

export interface AccessTokensPanelProps {
  readonly tokens: readonly AccessToken[];
  readonly i18n: I18n;
  readonly when: (iso: string) => string;
  readonly create: CreateAccessToken;
  readonly revoke: Revoke;
}

const ROW = 'flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0';
const DETAIL = 'text-xs leading-[18px] text-muted';
const NOTE = 'text-xs leading-[18px] text-muted';

interface DetailProps {
  readonly term: string;
  readonly value: string;
  readonly termHidden?: boolean;
}

function Detail({ term, value, termHidden = false }: DetailProps) {
  return (
    <div className="flex gap-1">
      <dt className={termHidden ? 'sr-only' : DETAIL}>{term}</dt>
      <dd className={DETAIL}>{value}</dd>
    </div>
  );
}

interface TokenRowProps {
  readonly token: AccessToken;
  readonly i18n: I18n;
  readonly when: (iso: string) => string;
  readonly revoke: Revoke;
}

export function accessTokenNameId(tokenId: string): string {
  return `access-token-name-${tokenId}`;
}

function TokenRow({ token, i18n, when, revoke }: TokenRowProps) {
  const nameId = accessTokenNameId(token.id);
  return (
    <li className={ROW}>
      <div className="flex min-w-0 flex-col gap-1">
        <span id={nameId} className="text-sm font-semibold text-ink">
          <Breakable text={token.name} />
        </span>
        <dl className="flex flex-wrap gap-x-4 gap-y-0.5">
          <Detail term={i18n.t('accessTokens.created')} value={when(token.createdAt)} />
          {token.lastUsedAt === null ? (
            <Detail
              term={i18n.t('accessTokens.lastUsed')}
              value={i18n.t('accessTokens.neverUsed')}
              termHidden
            />
          ) : (
            <Detail term={i18n.t('accessTokens.lastUsed')} value={when(token.lastUsedAt)} />
          )}
          <Detail term={i18n.t('accessTokens.expires')} value={when(token.expiresAt)} />
        </dl>
      </div>
      <RevokeButton id={token.id} describedBy={nameId} revoke={revoke} texts="accessTokens" />
    </li>
  );
}

export function AccessTokensPanel({ tokens, i18n, when, create, revoke }: AccessTokensPanelProps) {
  return (
    <section aria-labelledby="settings-access-tokens-heading" className={PANEL}>
      <h2 id="settings-access-tokens-heading" className={PANEL_TITLE}>
        {i18n.t('accessTokens.heading')}
      </h2>
      <p className={NOTE}>{i18n.t('accessTokens.note')}</p>
      <CreateAccessTokenForm create={create} limitReached={!canCreateAccessToken(tokens)} />
      {tokens.length === 0 ? (
        <p className="text-sm text-muted">{i18n.t('accessTokens.empty')}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line border-t border-line pt-3">
          {tokens.map((token) => (
            <TokenRow key={token.id} token={token} i18n={i18n} when={when} revoke={revoke} />
          ))}
        </ul>
      )}
    </section>
  );
}
