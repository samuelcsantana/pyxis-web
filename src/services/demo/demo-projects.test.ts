import { describe, expect, it } from 'vitest';
import { DEMO_ADMIN } from '../projects/mock-projects-service';
import { demoCountsConversions } from './demo-projects';

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
