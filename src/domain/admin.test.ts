import { describe, expect, it } from 'vitest';
import { emailInitial, findProject, meResponseSchema, projectInitials } from './admin';

const WIRE = {
  email: 'owner@demo-store.example',
  projects: [
    {
      id: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversion_event: 'signup_completed',
    },
  ],
};

describe('meResponseSchema', () => {
  it('maps the snake_case answer of /v1/me to the dashboard shape', () => {
    expect(meResponseSchema.parse(WIRE)).toEqual({
      email: 'owner@demo-store.example',
      projects: [
        {
          id: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
          name: 'Demo Store',
          timezone: 'America/Sao_Paulo',
          conversionEvent: 'signup_completed',
        },
      ],
    });
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
    expect(emailInitial('owner@demo-store.example')).toBe('O');
  });
});
