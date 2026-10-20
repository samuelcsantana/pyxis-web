import manifest from '../../package.json';

export const TRACKER_PACKAGE = 'pyxis-analytics';

const PINNABLE_RANGE = /^[\^~]?(\d+\.\d+\.\d+)$/;

export function pinnedVersion(range: string): string {
  const version = PINNABLE_RANGE.exec(range)?.[1];
  if (version === undefined) {
    throw new Error(`${TRACKER_PACKAGE} must be required as x.y.z, ^x.y.z or ~x.y.z, not ${range}`);
  }
  return version;
}

export const TRACKER_VERSION = pinnedVersion(manifest.dependencies[TRACKER_PACKAGE]);

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
