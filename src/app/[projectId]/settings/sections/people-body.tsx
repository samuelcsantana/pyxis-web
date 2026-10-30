import { PeoplePanel } from '@/components/settings/people-panel';
import { readOrSignIn } from '@/lib/current-admin';
import { createProjectPeopleService } from '@/services/project-people/project-people-service.factory';
import type { ProjectBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { addProjectPerson, removeProjectPerson } from '../actions';

export async function peopleBody({ settings, i18n, when, owner, admin }: ProjectBodyInput) {
  return (
    <PeoplePanel
      people={await readOrSignIn(() => createProjectPeopleService().list(settings.id))}
      myEmail={admin.email}
      i18n={i18n}
      when={when}
      manage={
        owner
          ? {
              add: addProjectPerson.bind(null, settings.id),
              remove: removeProjectPerson.bind(null, settings.id),
            }
          : null
      }
    />
  );
}
