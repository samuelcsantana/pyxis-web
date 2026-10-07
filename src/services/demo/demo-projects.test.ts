import { describe, expect, it } from 'vitest';
import { DEMO_ADMIN } from '../projects/mock-projects-service';
import { demoCountsConversions, demoTimeZone } from './demo-projects';

describe('demoCountsConversions', () => {
  it('follows the conversion event of the demo project', () => {
    const [store, docs] = DEMO_ADMIN.projects;

    expect(demoCountsConversions(store?.id ?? '')).toBe(true);
    expect(demoCountsConversions(docs?.id ?? '')).toBe(false);
  });

  it('counts conversions for a project it does not know', () => {
    expect(demoCountsConversions('unknown')).toBe(true);
  });
});

describe('demoTimeZone', () => {
  it('follows the time zone of the demo project, and UTC for one it does not know', () => {
    const [store, docs] = DEMO_ADMIN.projects;

    expect(demoTimeZone(store?.id ?? '')).toBe('America/Sao_Paulo');
    expect(demoTimeZone(docs?.id ?? '')).toBe('Europe/Lisbon');
    expect(demoTimeZone('unknown')).toBe('UTC');
  });
});
