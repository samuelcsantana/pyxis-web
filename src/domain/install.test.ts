import { describe, expect, it } from 'vitest';
import { installCommand, moduleSnippet, scriptSnippet } from './install';

const KEY = 'pyxis_pk_abc';
const ENDPOINT = 'https://api.pyxis-analytics.dev';
const INIT_LINE = "init({ key: 'pyxis_pk_abc', endpoint: 'https://api.pyxis-analytics.dev' });";

describe('install snippets', () => {
  it('installs the tracker from npm', () => {
    expect(installCommand()).toBe('npm install pyxis-analytics');
  });

  it('starts the tracker with the project key and the API', () => {
    expect(moduleSnippet(KEY, ENDPOINT)).toBe(
      `import { init } from 'pyxis-analytics';\n\n${INIT_LINE}`,
    );
  });

  it('loads a pinned version of the tracker in plain HTML', () => {
    const snippet = scriptSnippet(KEY, ENDPOINT);

    expect(snippet).toContain('https://unpkg.com/pyxis-analytics@0.2.1/dist/index.js');
    expect(snippet.split('\n')).toHaveLength(4);
    expect(snippet).toContain(INIT_LINE);
  });
});
