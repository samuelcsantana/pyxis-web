import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  TRACKER_VERSION,
  agentPrompt,
  connectorUrlOf,
  installCommand,
  moduleSnippet,
  pinnedVersion,
  scriptSnippet,
} from './install';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';

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
    expect(snippet).toContain(
      `https://cdn.jsdelivr.net/npm/pyxis-analytics@${TRACKER_VERSION}/dist/index.js`,
    );
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

describe('agentPrompt', () => {
  const values = { key: KEY, endpoint: ENDPOINT, origin: 'https://store.example.com' };

  it('asks the agent to follow the recipe with the key, the endpoint and the site', () => {
    expect(agentPrompt(values, english)).toBe(
      'Install Pyxis on this site following https://pyxis-analytics.dev/llms.txt. The project’s public key is pyxis_pk_abc, the endpoint is https://api.pyxis-analytics.dev and the site is at https://store.example.com. Measure the pages and record an event at each important action, with no personal data. At the end, list the files you changed and each event you created, with its name and properties, for me to review.',
    );
  });

  it('leaves the site out when the project allows no origin yet', () => {
    const prompt = agentPrompt({ ...values, origin: undefined }, english);

    expect(prompt).toContain(
      'The project’s public key is pyxis_pk_abc and the endpoint is https://api.pyxis-analytics.dev. Measure',
    );
    expect(prompt).not.toContain('the site is at');
  });

  it('speaks the language of the dashboard', () => {
    expect(agentPrompt(values, portuguese)).toMatch(
      /^Instale o Pyxis neste site seguindo https:\/\/pyxis-analytics\.dev\/llms\.txt\. A chave pública do projeto é pyxis_pk_abc, .* para eu revisar\.$/,
    );
  });
});

describe('connectorUrlOf', () => {
  it('reaches the MCP server of the API the snippets send to', () => {
    expect(connectorUrlOf(ENDPOINT)).toBe('https://api.pyxis-analytics.dev/mcp');
  });
});
