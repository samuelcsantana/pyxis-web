import { describe, expect, it } from 'vitest';
import { demoVisitorOf } from './demo-visitor-kinds';

describe('demoVisitorOf', () => {
  it.each([
    ['00000000-0000-4000-8000-000000000000', 'first_visit'],
    ['00000000-0000-4000-8000-000000000033', 'first_visit'],
    ['00000000-0000-4000-8000-000000000034', 'first_this_month'],
    ['00000000-0000-4000-8000-00000000003f', 'first_this_month'],
    ['00000000-0000-4000-8000-000000000040', 'first_today'],
    ['00000000-0000-4000-8000-000000000054', 'first_today'],
    ['00000000-0000-4000-8000-000000000055', 'again_today'],
    ['00000000-0000-4000-8000-000000000063', 'again_today'],
    ['00000000-0000-4000-8000-000000000064', 'first_visit'],
  ])('reads %s as %s, from the last four digits of the visit id', (sessionId, kind) => {
    expect(demoVisitorOf(sessionId)).toBe(kind);
  });
});
