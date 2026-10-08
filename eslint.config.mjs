import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { noComments } from './eslint-rules/no-comments.mjs';
import { noPixelFontSize } from './eslint-rules/no-pixel-font-size.mjs';

const DICTIONARY_IMPORTS = {
  group: ['**/i18n/messages/*', './messages/*'],
  message: 'Dictionaries stay on the server: translate with getTranslator() or useT().',
};

export default defineConfig(
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'storybook-static/**',
    'playwright-report/**',
    'test-results/**',
  ]),
  js.configs.recommended,
  ...nextVitals,
  {
    linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'error' },
    plugins: {
      local: { rules: { 'no-comments': noComments, 'no-pixel-font-size': noPixelFontSize } },
    },
    rules: { 'local/no-comments': 'error' },
  },
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          allowForKnownSafeCalls: [
            { from: 'package', package: 'node:test', name: ['describe', 'it', 'test'] },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: { 'local/no-pixel-font-size': 'error' },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/i18n/get-messages.ts',
      'src/i18n/messages.ts',
      'src/test-utils/**',
      'src/**/*.test.{ts,tsx}',
      'src/**/*.stories.tsx',
    ],
    rules: {
      'no-restricted-imports': ['error', { patterns: [DICTIONARY_IMPORTS] }],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
    ignores: ['src/components/**/*.test.tsx', 'src/components/**/*.stories.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'zod', message: 'Components reach the browser: validate on the server.' },
          ],
          patterns: [
            {
              group: ['@/domain/*.schema'],
              message: 'Components reach the browser: import the pure domain module instead.',
            },
            DICTIONARY_IMPORTS,
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  prettier,
);
