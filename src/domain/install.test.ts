import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  TRACKER_VERSION,
  installCommand,
  moduleSnippet,
  pinnedVersion,
  scriptSnippet,
} from './install';

const KEY = 'pyxis_pk_abc';
const ENDPOINT = 'https://api.pyxis-analytics.dev';
const INIT_LINE = "init({ key: 'pyxis_pk_abc', endpoint: 'https://api.pyxis-analytics.dev' });";
const INSTALLED_TRACKER_MANIFEST = path.resolve(
  import.meta.dirname,
  '../../node_modules/pyxis-analytics/package.json',
);

describe('install snippets', () => {
  it('installs the tracker from npm', () => {
    expect(installCommand()).toBe('npm install pyxis-analytics');
  });

  it('starts the tracker with the project key and the API', () => {
    expect(moduleSnippet(KEY, ENDPOINT)).toBe(
      `import { init } from 'pyxis-analytics';\n\n${INIT_LINE}`,
    );
  });

  it('loads in plain HTML the exact tracker version this dashboard installs', () => {
    const installed: unknown = JSON.parse(readFileSync(INSTALLED_TRACKER_MANIFEST, 'utf8'));
    const snippet = scriptSnippet(KEY, ENDPOINT);

    expect(installed).toMatchObject({ version: TRACKER_VERSION });
    expect(snippet).toContain(`https://unpkg.com/pyxis-analytics@${TRACKER_VERSION}/dist/index.js`);
    expect(snippet).toMatch(/pyxis-analytics@\d+\.\d+\.\d+\/dist\/index\.js/);
    expect(snippet.split('\n')).toHaveLength(4);
    expect(snippet).toContain(INIT_LINE);
  });
});

describe('pinnedVersion', () => {
  it.each([
    ['0.5.0', '0.5.0'],
    ['^0.5.0', '0.5.0'],
    ['~1.2.3', '1.2.3'],
  ])('pins %s to %s', (range, version) => {
    expect(pinnedVersion(range)).toBe(version);
  });

  it.each(['latest', '>=0.5.0', '^0.5', '0.5.x', '^0.5.0 || ^0.6.0'])(
    'refuses a range with no single version to pin: %s',
    (range) => {
      expect(() => pinnedVersion(range)).toThrow(`not ${range}`);
    },
  );
});
