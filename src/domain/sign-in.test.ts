import { describe, expect, it } from 'vitest';
import { codeProblem, emailProblem } from './sign-in';

describe('emailProblem', () => {
  it.each(['', '   '])('calls %j missing', (email) => {
    expect(emailProblem(email)).toBe('emailMissing');
  });

  it.each(['ana', 'ana@', '@example.com', 'ana@example', 'ana@example.c', 'ana example@x.com'])(
    'calls %j malformed',
    (email) => {
      expect(emailProblem(email)).toBe('emailMalformed');
    },
  );

  it.each([
    'ana@example.com',
    '  ana@example.com ',
    'ana.maria+pyxis@mail.example.com.br',
    "o'neil@example.org",
  ])('accepts %j, as the API does', (email) => {
    expect(emailProblem(email)).toBeNull();
  });
});

describe('codeProblem', () => {
  it('calls a code shorter than its length incomplete', () => {
    expect(codeProblem('12345', 6)).toBe('codeIncomplete');
  });

  it('accepts a code of its length', () => {
    expect(codeProblem('123456', 6)).toBeNull();
  });
});
