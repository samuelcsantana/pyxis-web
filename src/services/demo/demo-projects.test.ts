import { describe, expect, it } from 'vitest';
import { DEMO_DOCS, DEMO_PROJECTS, DEMO_STORE, demoPersonOf, demoProjectOf } from './demo-projects';

describe('demoProjectOf', () => {
  it('finds each demo project by its id', () => {
    for (const project of DEMO_PROJECTS) {
      expect(demoProjectOf(project.id)).toBe(project);
    }
  });

  it('answers with the store for a project it does not know', () => {
    expect(demoProjectOf('unknown')).toBe(DEMO_STORE);
  });
});

describe('demoPersonOf', () => {
  it('names the demo person of the store and nobody for the docs', () => {
    expect(demoPersonOf(DEMO_STORE.id)).toBe('u_7f3a');
    expect(demoPersonOf(DEMO_DOCS.id)).toBeNull();
  });
});
