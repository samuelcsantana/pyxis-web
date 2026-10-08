import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/nextjs-vite';
import { MessagesProvider } from '@/i18n/messages-provider';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import '../src/app/globals.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
        <Story />
      </MessagesProvider>
    ),
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
      parentSelector: 'html',
    }),
  ],
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;
