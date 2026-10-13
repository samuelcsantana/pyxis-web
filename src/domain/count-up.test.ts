import { describe, expect, it } from 'vitest';
import { countFrame, easeOut, numberPartsOf } from './count-up';

describe('numberPartsOf', () => {
  it('reads a count with thousands separators in either language', () => {
    expect(numberPartsOf('2,759', 'en-US')).toEqual({
      prefix: '',
      value: 2759,
      decimals: 0,
      suffix: '',
    });
    expect(numberPartsOf('2.759', 'pt-BR')?.value).toBe(2759);
  });

  it('reads a rate with its decimals and its sign', () => {
    expect(numberPartsOf('2.3%', 'en-US')).toEqual({
      prefix: '',
      value: 2.3,
      decimals: 1,
      suffix: '%',
    });
    expect(numberPartsOf('0,4%', 'pt-BR')).toMatchObject({ value: 0.4, decimals: 1 });
    expect(numberPartsOf('≈ 12 visits', 'en-US')).toMatchObject({
      prefix: '≈ ',
      value: 12,
      suffix: ' visits',
    });
  });

  it('reads nothing from text without a number, or with a malformed one', () => {
    expect(numberPartsOf('—', 'en-US')).toBeNull();
    expect(numberPartsOf('1.2.3', 'en-US')).toBeNull();
  });
});

describe('countFrame', () => {
  it('counts up in the format of the final value', () => {
    expect(countFrame('2,759', 0, 'en-US')).toBe('0');
    expect(countFrame('2,759', 0.5, 'en-US')).toBe('1,380');
    expect(countFrame('2,3%', 0.5, 'pt-BR')).toBe('1,2%');
    expect(countFrame('2,759', -0.2, 'en-US')).toBe('0');
  });

  it('ends on the exact text it was given, and leaves text without a number alone', () => {
    expect(countFrame('2,759', 1, 'en-US')).toBe('2,759');
    expect(countFrame('—', 0.5, 'en-US')).toBe('—');
  });
});

describe('easeOut', () => {
  it('starts fast and settles on the end', () => {
    expect(easeOut(0)).toBe(0);
    expect(easeOut(0.5)).toBe(0.875);
    expect(easeOut(1)).toBe(1);
  });
});
