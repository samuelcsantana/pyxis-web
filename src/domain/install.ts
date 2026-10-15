export const TRACKER_PACKAGE = 'pyxis-analytics';
export const TRACKER_VERSION = '0.2.1';

export function installCommand(): string {
  return `npm install ${TRACKER_PACKAGE}`;
}

export function moduleSnippet(key: string, endpoint: string): string {
  return [
    `import { init } from '${TRACKER_PACKAGE}';`,
    '',
    `init({ key: '${key}', endpoint: '${endpoint}' });`,
  ].join('\n');
}

export function scriptSnippet(key: string, endpoint: string): string {
  return [
    '<script type="module">',
    `  import { init } from 'https://unpkg.com/${TRACKER_PACKAGE}@${TRACKER_VERSION}/dist/index.js';`,
    `  init({ key: '${key}', endpoint: '${endpoint}' });`,
    '</script>',
  ].join('\n');
}
