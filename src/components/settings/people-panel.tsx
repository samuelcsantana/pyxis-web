import { Breakable } from '@/components/ui/breakable';
import { SECTION_BODY, SECTION_LIST } from '@/components/ui/panel-classes';
import { MAX_ACCOUNT_PEOPLE, ownerFirst, type ProjectPerson } from '@/domain/project-people';
import type { I18n } from '@/i18n/i18n';
import { type AddPerson, AddPersonForm } from './add-person-form';
import { type RemovePerson, RemovePersonButton } from './remove-person-button';

export interface PeoplePanelProps {
  readonly people: readonly ProjectPerson[];
  readonly myEmail: string;
  readonly i18n: I18n;
  readonly when: (iso: string) => string;
  readonly manage: { readonly add: AddPerson; readonly remove: RemovePerson } | null;
}

const ROW = 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3';
const NOTE = 'text-xs leading-[18px] text-muted';
const ROLE_LABELS = { owner: 'people.owner', member: 'people.member' } as const;

export function personRowId(adminUserId: string): string {
  return `person-${adminUserId}`;
}

export function PeoplePanel({ people, myEmail, i18n, when, manage }: PeoplePanelProps) {
  return (
    <div className={SECTION_BODY}>
      <p className={NOTE}>
        {manage === null
          ? i18n.t('people.note')
          : i18n.t('people.noteOwner', { max: i18n.format.count(MAX_ACCOUNT_PEOPLE) })}
      </p>
      <ul className={SECTION_LIST}>
        {ownerFirst(people).map((person) => (
          <li key={person.adminUserId} className={ROW}>
            <div id={personRowId(person.adminUserId)} className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink">
                <Breakable
                  text={
                    person.email === myEmail
                      ? i18n.t('people.you', { email: person.email })
                      : person.email
                  }
                />
              </span>
              <span className="text-xs text-muted">
                {i18n.t(ROLE_LABELS[person.role])} ·{' '}
                {i18n.t('people.added', { date: when(person.addedAt) })}
              </span>
            </div>
            {manage === null || person.role === 'owner' ? null : (
              <RemovePersonButton
                adminUserId={person.adminUserId}
                describedBy={personRowId(person.adminUserId)}
                remove={manage.remove}
              />
            )}
          </li>
        ))}
      </ul>
      {manage === null ? null : (
        <div className="border-t border-line pt-3">
          <AddPersonForm add={manage.add} />
        </div>
      )}
    </div>
  );
}
