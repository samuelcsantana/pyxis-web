import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
    'storybook-addon-pseudo-states',
  ],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  core: { disableTelemetry: true },
  viteFinal: (viteConfig) => {
    const basePath = process.env.STORYBOOK_BASE_PATH;
    return basePath ? { ...viteConfig, base: basePath } : viteConfig;
  },
};

export default config;
