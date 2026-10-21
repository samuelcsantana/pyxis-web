import { describe, expect, it } from 'vitest';
import {
  emailInitial,
  findProject,
  ingestionSuspensionOf,
  projectIconHref,
  projectInitials,
} from './admin';
import { meResponseSchema } from './admin.schema';

const WIRE = {
  email: 'owner@example.com',
  projects: [
    {
      id: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversion_event: 'signup_completed',
      ingestion_suspended_at: null,
      ingestion_suspension_reason: null,
    },
  ],
};

describe('meResponseSchema', () => {
  it('maps the snake_case answer of /v1/me to the dashboard shape', () => {
    expect(meResponseSchema.parse(WIRE)).toEqual({
      email: 'owner@example.com',
      projects: [
        {
          id: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
          name: 'Demo Store',
          timezone: 'America/Sao_Paulo',
          conversionEvent: 'signup_completed',
          iconVersion: null,
          ingestionSuspendedAt: null,
          ingestionSuspensionReason: null,
        },
      ],
    });
  });

  it('reads the version of the icon taken from the project site', () => {
    const [project] = meResponseSchema.parse({
      ...WIRE,
      projects: [{ ...WIRE.projects[0], icon_version: '0123456789abcdef' }],
    }).projects;

    expect(project?.iconVersion).toBe('0123456789abcdef');
  });

  it('reads when the events of each project began and last arrived, null before the first', () => {
    const [active, waiting] = meResponseSchema.parse({
      ...WIRE,
      projects: [
        {
          ...WIRE.projects[0],
          first_event_at: '2026-03-02T12:00:00.000Z',
          last_event_at: '2026-10-05T21:41:05.000Z',
        },
        { ...WIRE.projects[0], id: 'waiting', first_event_at: null, last_event_at: null },
      ],
    }).projects;

    expect(active?.firstEventAt).toBe('2026-03-02T12:00:00.000Z');
    expect(active?.lastEventAt).toBe('2026-10-05T21:41:05.000Z');
    expect(waiting?.firstEventAt).toBeNull();
    expect(waiting?.lastEventAt).toBeNull();
  });

  it('leaves the event times unknown when an older API does not send them', () => {
    const [project] = meResponseSchema.parse(WIRE).projects;

    expect(project?.firstEventAt).toBeUndefined();
    expect(project?.lastEventAt).toBeUndefined();
  });

  it('reads a suspended reception, with the reason the API gives the owner', () => {
    const [owned, shared] = meResponseSchema.parse({
      ...WIRE,
      projects: [
        {
          ...WIRE.projects[0],
          ingestion_suspended_at: '2026-11-19T10:00:00.000Z',
          ingestion_suspension_reason: 'Events carried e-mail addresses.',
        },
        {
          ...WIRE.projects[0],
          id: 'shared',
          ingestion_suspended_at: '2026-11-19T10:00:00.000Z',
          ingestion_suspension_reason: null,
        },
      ],
    }).projects;

    expect(owned?.ingestionSuspendedAt).toBe('2026-11-19T10:00:00.000Z');
    expect(owned?.ingestionSuspensionReason).toBe('Events carried e-mail addresses.');
    expect(shared?.ingestionSuspensionReason).toBeNull();
  });

  it('tolerates fields the API adds later', () => {
    expect(meResponseSchema.safeParse({ ...WIRE, role: 'owner' }).success).toBe(true);
  });

  it('refuses an answer without the projects', () => {
    expect(meResponseSchema.safeParse({ email: WIRE.email }).success).toBe(false);
  });
});

describe('findProject', () => {
  it('finds a project the admin may read and nothing else', () => {
    const admin = meResponseSchema.parse(WIRE);

    expect(findProject(admin, '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d')?.name).toBe('Demo Store');
    expect(findProject(admin, 'someone-elses-project')).toBeUndefined();
  });
});

describe('projectInitials and emailInitial', () => {
  it('take the first letters of the first two words', () => {
    expect(projectInitials('Demo Store')).toBe('DS');
    expect(projectInitials('  acme   docs portal ')).toBe('AD');
  });

  it('take the first two letters of a single word', () => {
    expect(projectInitials('shop')).toBe('SH');
  });

  it('take the first letter of an email', () => {
    expect(emailInitial('owner@example.com')).toBe('O');
  });
});

describe('ingestionSuspensionOf', () => {
  const project = { id: 'p1', name: 'Demo Store', timezone: 'UTC', conversionEvent: null };

  it('says since when, and why when the API told the owner', () => {
    expect(
      ingestionSuspensionOf({
        ...project,
        ingestionSuspendedAt: '2026-11-19T10:00:00.000Z',
        ingestionSuspensionReason: 'Events carried e-mail addresses.',
      }),
    ).toEqual({ since: '2026-11-19T10:00:00.000Z', reason: 'Events carried e-mail addresses.' });
    expect(
      ingestionSuspensionOf({ ...project, ingestionSuspendedAt: '2026-11-19T10:00:00.000Z' }),
    ).toEqual({ since: '2026-11-19T10:00:00.000Z', reason: null });
  });

  it('is nothing while the project takes events', () => {
    expect(ingestionSuspensionOf({ ...project, ingestionSuspendedAt: null })).toBeNull();
    expect(ingestionSuspensionOf(project)).toBeNull();
  });
});

describe('projectIconHref', () => {
  const project = {
    id: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
    name: 'Demo Store',
    timezone: 'UTC',
    conversionEvent: null,
  };

  it('points at the icon route of the project, versioned so it caches until the icon changes', () => {
    expect(projectIconHref({ ...project, iconVersion: '0123456789abcdef' })).toBe(
      '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/icon?v=0123456789abcdef',
    );
  });

  it('points nowhere when the project has no icon', () => {
    expect(projectIconHref({ ...project, iconVersion: null })).toBeNull();
    expect(projectIconHref(project)).toBeNull();
  });
});
