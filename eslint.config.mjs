import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { noComments } from './eslint-rules/no-comments.mjs';

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
    plugins: { local: { rules: { 'no-comments': noComments } } },
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
    files: ['**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  prettier,
);
