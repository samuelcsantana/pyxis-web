import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { noPixelFontSize } from './no-pixel-font-size.mjs';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});
const pixelFontSize = { messageId: 'pixelFontSize' };

ruleTester.run('no-pixel-font-size', noPixelFontSize, {
  valid: [
    { name: 'a rem token', code: "const a = 'text-caption font-medium';" },
    { name: 'a Tailwind size', code: "const a = 'text-sm sm:text-base';" },
    { name: 'an arbitrary size in rem', code: "const a = 'text-[0.8125rem]';" },
    { name: 'a colour in brackets', code: "const a = 'text-[#123456]';" },
    { name: 'pixels on another utility', code: "const a = 'p-[3px] rounded-[3px]';" },
    { name: 'a word that ends in text', code: "const a = 'context-[13px]';" },
    { name: 'a number', code: 'const a = 13;' },
  ],
  invalid: [
    { name: 'a pixel size', code: "const a = 'text-[13px]';", errors: [pixelFontSize] },
    {
      name: 'a pixel size after other classes',
      code: "const a = 'font-semibold text-[22px] leading-7';",
      errors: [pixelFontSize],
    },
    {
      name: 'a pixel size behind a variant',
      code: "const a = 'sm:text-[28px]';",
      errors: [pixelFontSize],
    },
    { name: 'an important pixel size', code: "const a = '!text-[11px]';", errors: [pixelFontSize] },
    { name: 'a decimal pixel size', code: "const a = 'text-[13.5px]';", errors: [pixelFontSize] },
    {
      name: 'a typed pixel size',
      code: "const a = 'text-[length:15px]';",
      errors: [pixelFontSize],
    },
    {
      name: 'a pixel size in a template literal',
      code: 'const a = `rounded-pill text-[11px] ${tone}`;',
      errors: [pixelFontSize],
    },
    {
      name: 'a pixel size in a className attribute',
      code: 'const a = <p className="text-[15px]">Hi</p>;',
      errors: [pixelFontSize],
    },
  ],
});
