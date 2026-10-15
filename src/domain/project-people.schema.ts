import { z } from 'zod';
import type { ProjectPerson } from './project-people';
import { PROJECT_ROLES } from './project-settings';

const personWireSchema = z.object({
  admin_user_id: z.string(),
  email: z.string(),
  role: z.enum(PROJECT_ROLES),
  added_at: z.string(),
});

function fromWire(body: z.infer<typeof personWireSchema>): ProjectPerson {
  return {
    adminUserId: body.admin_user_id,
    email: body.email,
    role: body.role,
    addedAt: body.added_at,
  };
}

export const projectPeopleResponseSchema = z
  .object({ people: z.array(personWireSchema) })
  .transform((body): readonly ProjectPerson[] => body.people.map(fromWire));

export const addedPersonResponseSchema = z
  .object({ person: personWireSchema, added: z.boolean() })
  .transform((body) => ({ person: fromWire(body.person), added: body.added }));

export function newPersonWire(email: string, locale: string) {
  return { email: email.trim(), locale };
}
