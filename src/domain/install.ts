import type { I18n } from '@/i18n/i18n';
import { LANDING_ORIGIN } from '@/lib/site';
import manifest from '../../package.json';

export const TRACKER_PACKAGE = 'pyxis-analytics';
export const AGENT_RECIPE_URL = `${LANDING_ORIGIN}/llms.txt`;
export const TAG_MANAGER_TEMPLATE_URL = 'https://github.com/samuelcsantana/pyxis-gtm-template';
export const TAG_MANAGER_TEMPLATE_FILE_URL = `${TAG_MANAGER_TEMPLATE_URL}/blob/main/template.tpl`;
export const TAG_MANAGER_GUIDE_URL = `${TAG_MANAGER_TEMPLATE_URL}#install`;
export const WORDPRESS_HEADER_PLUGIN_URL =
  'https://wordpress.org/plugins/insert-headers-and-footers/';
const CONNECTOR_PATH = '/mcp';

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
    `  import { init } from 'https://cdn.jsdelivr.net/npm/${TRACKER_PACKAGE}@${TRACKER_VERSION}/dist/index.js';`,
    `  init({ key: '${key}', endpoint: '${endpoint}' });`,
    '</script>',
  ].join('\n');
}

export function classicSnippet(key: string, endpoint: string): string {
  return [
    `<script src="https://cdn.jsdelivr.net/npm/${TRACKER_PACKAGE}@${TRACKER_VERSION}/dist/pyxis.global.js"></script>`,
    '<script>',
    `  pyxis.init({ key: '${key}', endpoint: '${endpoint}' });`,
    '</script>',
  ].join('\n');
}

export interface AgentPromptValues {
  readonly key: string;
  readonly endpoint: string;
  readonly origin: string | undefined;
}

export function agentPrompt({ key, endpoint, origin }: AgentPromptValues, i18n: I18n): string {
  const recipe = AGENT_RECIPE_URL;
  return origin === undefined
    ? i18n.t('install.agent.promptAnySite', { recipe, key, endpoint })
    : i18n.t('install.agent.prompt', { recipe, key, endpoint, origin });
}

export function connectorUrlOf(endpoint: string): string {
  return `${endpoint}${CONNECTOR_PATH}`;
}
