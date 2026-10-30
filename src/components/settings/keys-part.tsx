import type { ReactNode } from 'react';
import { Breakable } from '@/components/ui/breakable';
import {
  hasLivePublicKey,
  type ProjectKeySummary,
  type ProjectSettings,
} from '@/domain/project-settings';
import type { I18n } from '@/i18n/i18n';
import { type CreateProjectKey, CreateProjectKeyButton } from './create-project-key-button';
import { NoLiveKeyNotice } from './no-live-key-notice';
import { CODE, ITEM_LIST, NOTE, PART_STACK, SubSection, type When } from './part-pieces';
import { type RevokeProjectKey, RevokeProjectKeyButton } from './revoke-project-key-button';

export interface KeyManagement {
  readonly createKey: CreateProjectKey;
  readonly revokeKey: RevokeProjectKey;
}

export interface KeysPartProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly when: When;
  readonly manage: KeyManagement | null;
}

export function projectKeyId(keyId: string): string {
  return `project-key-${keyId}`;
}

const PUBLIC_KEYS_HEADING = 'settings-public-keys-heading';
const SECRET_KEYS_HEADING = 'settings-secret-keys-heading';
const MANAGED_LIST = 'flex flex-col divide-y divide-line';

interface KeyListProps<Key extends ProjectKeySummary> {
  readonly keys: readonly Key[];
  readonly empty: ReactNode;
  readonly describe: (key: Key) => ReactNode;
}

function KeyList<Key extends ProjectKeySummary>({ keys, empty, describe }: KeyListProps<Key>) {
  return keys.length === 0 ? (
    empty
  ) : (
    <ul className={ITEM_LIST}>
      {keys.map((key) => (
        <li key={key.id} className="flex flex-col gap-0.5 text-sm">
          {describe(key)}
        </li>
      ))}
    </ul>
  );
}

interface ManagedKeyRowProps {
  readonly keyId: string;
  readonly children: ReactNode;
  readonly action: ReactNode;
}

function ManagedKeyRow({ keyId, children, action }: ManagedKeyRowProps) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-2.5 first:pt-0 last:pb-0">
      <div id={projectKeyId(keyId)} className="flex min-w-0 flex-col gap-0.5 text-sm">
        {children}
      </div>
      {action}
    </li>
  );
}

function createdLine(i18n: I18n, when: When) {
  return function Created(key: ProjectKeySummary) {
    return (
      <span className="text-xs text-muted">
        {i18n.t('settings.keys.created', { date: when(key.createdAt) })}
      </span>
    );
  };
}

function ReadOnlyKeys({ settings, i18n, when }: Omit<KeysPartProps, 'manage'>) {
  const created = createdLine(i18n, when);
  return (
    <div className={PART_STACK}>
      <SubSection id={PUBLIC_KEYS_HEADING} title={i18n.t('settings.keys.public')}>
        <KeyList
          keys={settings.publicKeys}
          empty={<NoLiveKeyNotice step={{ kind: 'ownerOnly' }} i18n={i18n} />}
          describe={(key) => (
            <>
              <code className={CODE}>
                <Breakable text={key.key} />
              </code>
              {created(key)}
            </>
          )}
        />
        <p className={NOTE}>{i18n.t('settings.keys.publicNote')}</p>
      </SubSection>
      <SubSection id={SECRET_KEYS_HEADING} title={i18n.t('settings.keys.secret')}>
        <KeyList
          keys={settings.secretKeys}
          empty={<p className="text-sm">{i18n.t('settings.keys.noSecretKey')}</p>}
          describe={created}
        />
        <p className={NOTE}>{i18n.t('settings.keys.secretNote')}</p>
      </SubSection>
    </div>
  );
}

interface ManagedKeysProps extends Omit<KeysPartProps, 'manage'> {
  readonly manage: KeyManagement;
}

function ManagedKeys({ settings, i18n, when, manage }: ManagedKeysProps) {
  const created = createdLine(i18n, when);
  const onlyPublicKey = settings.publicKeys.length === 1;
  const revoke = (keyId: string) => (
    <RevokeProjectKeyButton
      keyId={keyId}
      describedBy={projectKeyId(keyId)}
      revoke={manage.revokeKey}
    />
  );
  return (
    <div className={PART_STACK}>
      <SubSection id={PUBLIC_KEYS_HEADING} title={i18n.t('settings.keys.public')}>
        {hasLivePublicKey(settings) ? (
          <ul className={MANAGED_LIST}>
            {settings.publicKeys.map((key) => (
              <ManagedKeyRow
                key={key.id}
                keyId={key.id}
                action={
                  onlyPublicKey ? (
                    <p className="max-w-60 text-xs text-muted">
                      {i18n.t('projectKeys.onlyPublicKey')}
                    </p>
                  ) : (
                    revoke(key.id)
                  )
                }
              >
                <code className={CODE}>
                  <Breakable text={key.key} />
                </code>
                {created(key)}
              </ManagedKeyRow>
            ))}
          </ul>
        ) : (
          <NoLiveKeyNotice step={{ kind: 'createBelow' }} i18n={i18n} />
        )}
        <p className={NOTE}>{i18n.t('settings.keys.publicNote')}</p>
        <CreateProjectKeyButton kind="public" create={manage.createKey} />
      </SubSection>
      <SubSection id={SECRET_KEYS_HEADING} title={i18n.t('settings.keys.secret')}>
        {settings.secretKeys.length === 0 ? (
          <p className="text-sm">{i18n.t('settings.keys.noSecretKey')}</p>
        ) : (
          <ul className={MANAGED_LIST}>
            {settings.secretKeys.map((key) => (
              <ManagedKeyRow key={key.id} keyId={key.id} action={revoke(key.id)}>
                {created(key)}
              </ManagedKeyRow>
            ))}
          </ul>
        )}
        <p className={NOTE}>{i18n.t('settings.keys.secretNote')}</p>
        <CreateProjectKeyButton kind="secret" create={manage.createKey} />
      </SubSection>
    </div>
  );
}

export function KeysPart({ settings, i18n, when, manage }: KeysPartProps) {
  return manage === null ? (
    <ReadOnlyKeys settings={settings} i18n={i18n} when={when} />
  ) : (
    <ManagedKeys settings={settings} i18n={i18n} when={when} manage={manage} />
  );
}
