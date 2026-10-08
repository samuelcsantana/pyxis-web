import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { noLiteralJsxText } from './no-literal-jsx-text.mjs';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});
const literalText = { messageId: 'literalText' };
const ALLOW = [{ allow: ['Pyxis'] }];

ruleTester.run('no-literal-jsx-text', noLiteralJsxText, {
  valid: [
    { name: 'text from the dictionary', code: "const a = <p>{t('overview.title')}</p>;" },
    { name: 'a value', code: 'const a = <p>{visits}</p>;' },
    { name: 'whitespace between elements', code: "const a = <p>\n  <b>{x}</b>{' '}\n</p>;" },
    { name: 'punctuation and symbols', code: 'const a = <p>{x} · {y} → ✕ ↑ — ( ) %</p>;' },
    { name: 'numbers', code: 'const a = <p>{x} 2 / 8</p>;' },
    { name: 'an allowed word', code: 'const a = <span>Pyxis</span>;', options: ALLOW },
    {
      name: 'an allowed word with spaces around it',
      code: 'const a = <span>\n  Pyxis\n</span>;',
      options: ALLOW,
    },
    { name: 'a class name', code: 'const a = <p className="text-sm font-semibold">{x}</p>;' },
    { name: 'an id and a role', code: 'const a = <p id="funnel-heading" role="status">{x}</p>;' },
    { name: 'a label from the dictionary', code: "const a = <nav aria-label={t('nav.label')} />;" },
    {
      name: 'a label from a value',
      code: 'const a = <a aria-label={row.label} title={row.title} />;',
    },
    {
      name: 'a template label without words',
      code: 'const a = <a aria-label={`${count} · ${name}`} />;',
    },
    { name: 'a symbol placeholder', code: 'const a = <input placeholder="—" />;' },
    { name: 'an attribute without a value', code: 'const a = <input disabled />;' },
    {
      name: 'a conditional of values',
      code: 'const a = <p>{open ? closeLabel : openLabel}</p>;',
    },
    { name: 'a fallback symbol', code: "const a = <p>{value ?? '—'}</p>;" },
    { name: 'a number in braces', code: 'const a = <p>{42}</p>;' },
    {
      name: 'a namespaced attribute that is not text',
      code: 'const a = <svg xlink:href="#icon" />;',
    },
    { name: 'a string outside JSX', code: "const a = 'Overall conversion';" },
  ],
  invalid: [
    { name: 'text in an element', code: 'const a = <h2>Steps</h2>;', errors: [literalText] },
    {
      name: 'text beside a value',
      code: 'const a = <label>Step {position} type</label>;',
      errors: [literalText, literalText],
    },
    {
      name: 'a word that is not allowed',
      code: 'const a = <span>Pyxis rocks</span>;',
      options: ALLOW,
      errors: [literalText],
    },
    {
      name: 'a string in braces',
      code: "const a = <p>{'Nothing here'}</p>;",
      errors: [literalText],
    },
    {
      name: 'strings in a conditional',
      code: "const a = <p>{open ? 'Close the editor' : 'Edit steps'}</p>;",
      errors: [literalText],
    },
    {
      name: 'a string after a logical operator',
      code: "const a = <p>{name || 'Unknown'}</p>;",
      errors: [literalText],
    },
    {
      name: 'a template string with words',
      code: 'const a = <p>{`${count} visits`}</p>;',
      errors: [literalText],
    },
    {
      name: 'an aria-label',
      code: 'const a = <nav aria-label="Count by" />;',
      errors: [literalText],
    },
    {
      name: 'an aria-label template with words',
      code: 'const a = <button aria-label={`Move step ${position} up`} />;',
      errors: [literalText],
    },
    {
      name: 'a placeholder in braces',
      code: "const a = <input placeholder={'signup_completed'} />;",
      errors: [literalText],
    },
    {
      name: 'a placeholder chosen by a condition',
      code: "const a = <input placeholder={index === 0 ? '/pricing' : undefined} />;",
      errors: [literalText],
    },
    { name: 'a title', code: 'const a = <Topbar title="Funnel" />;', errors: [literalText] },
    {
      name: 'a subtitle',
      code: 'const a = <Topbar subtitle="Where people drop off" />;',
      errors: [literalText],
    },
    { name: 'an alt text', code: 'const a = <img alt="Pyxis logo" />;', errors: [literalText] },
    {
      name: 'a label prop',
      code: 'const a = <StatCard label="Biggest drop-off" />;',
      errors: [literalText],
    },
    {
      name: 'a namespaced text attribute',
      code: 'const a = <a xlink:title="Open the visit" />;',
      errors: [literalText],
    },
  ],
});
