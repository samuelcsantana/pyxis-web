import { describe, expect, it } from 'vitest';
import { ownerFirst, type ProjectPerson } from './project-people';

function person(email: string, role: ProjectPerson['role']): ProjectPerson {
  return { adminUserId: email, email, role, addedAt: '2026-10-15T12:00:00.000Z' };
}

describe('ownerFirst', () => {
  it('puts the owner first and keeps everyone else in the order the API gave', () => {
    const people = [
      person('ana@example.com', 'member'),
      person('owner@example.com', 'owner'),
      person('bia@example.com', 'member'),
    ];

    expect(ownerFirst(people).map(({ email }) => email)).toEqual([
      'owner@example.com',
      'ana@example.com',
      'bia@example.com',
    ]);
    expect(people[0]?.email).toBe('ana@example.com');
  });
});
