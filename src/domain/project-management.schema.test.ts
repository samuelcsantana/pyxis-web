import { describe, expect, it } from 'vitest';
import {
  createdProjectKeyResponseSchema,
  deletedProjectResponseSchema,
  managedProjectResponseSchema,
  projectChangesWire,
  projectDeletionWire,
} from './project-management.schema';

describe('project management on the wire', () => {
  it('reads a new key from its answer', () => {
    expect(
      createdProjectKeyResponseSchema.parse({ id: 'k1', kind: 'public', key: 'pyxis_pk_x' }),
    ).toEqual({ id: 'k1', kind: 'public', key: 'pyxis_pk_x' });
  });

  it('accepts the answers of a change and of a deletion, keeping nothing from them', () => {
    expect(managedProjectResponseSchema.safeParse({ id: 'p1', name: 'Shop' })).toEqual({
      success: true,
      data: undefined,
    });
    expect(
      deletedProjectResponseSchema.safeParse({
        project_id: 'p1',
        deleted_events: 3,
        deleted_keys: 2,
      }),
    ).toEqual({ success: true, data: undefined });
  });

  it('refuses a key of a kind it does not know', () => {
    expect(() =>
      createdProjectKeyResponseSchema.parse({ id: 'k1', kind: 'private', key: 'x' }),
    ).toThrow();
  });

  it('writes the changes and the deletion with the API field names', () => {
    expect(
      projectChangesWire({
        name: 'Shop',
        allowedOrigins: ['https://shop.example.com'],
        timezone: 'UTC',
        conversionEvent: 'signup_completed',
      }),
    ).toEqual({
      name: 'Shop',
      allowed_origins: ['https://shop.example.com'],
      timezone: 'UTC',
      conversion_event: 'signup_completed',
    });
    expect(projectDeletionWire('Shop')).toEqual({ confirm_name: 'Shop' });
  });
});
