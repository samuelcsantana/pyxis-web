import { describe, expect, it } from 'vitest';
import { codeProblem, countdownLabel, emailProblem } from './sign-in';

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

describe('countdownLabel', () => {
  it.each([
    [30_000, '0:30'],
    [29_001, '0:30'],
    [29_000, '0:29'],
    [9_000, '0:09'],
    [90_000, '1:30'],
    [0, '0:00'],
    [-500, '0:00'],
  ])('writes %i milliseconds as %s, rounding up to the second', (milliseconds, label) => {
    expect(countdownLabel(milliseconds)).toBe(label);
  });
});
