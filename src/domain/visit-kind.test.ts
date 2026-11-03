import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { countsAsUniqueToday, VISIT_KINDS, visitKindBadge } from './visit-kind';

describe('countsAsUniqueToday', () => {
  it('counts every kind but another visit the same day', () => {
    expect(VISIT_KINDS.filter(countsAsUniqueToday)).toEqual([
      'first_visit',
      'first_this_month',
      'first_today',
    ]);
  });
});

describe('visitKindBadge', () => {
  it('shows nothing for a visit without a kind', () => {
    expect(visitKindBadge(null, english)).toBeNull();
  });

  it('names each kind and says whether it counted in the day', () => {
    expect(VISIT_KINDS.map((kind) => visitKindBadge(kind, english))).toEqual([
      { label: 'New visitor', note: 'Counted in the day’s unique visitors', counted: true },
      {
        label: 'Returning, first this month',
        note: 'Counted in the day’s unique visitors',
        counted: true,
      },
      {
        label: 'Returning, first today',
        note: 'Counted in the day’s unique visitors',
        counted: true,
      },
      {
        label: 'Again today',
        note: 'Not counted: this browser had already come today',
        counted: false,
      },
    ]);
  });

  it('speaks the language of the dashboard', () => {
    expect(visitKindBadge('again_today', portuguese)).toEqual({
      label: 'De novo hoje',
      note: 'Não contou: este navegador já tinha vindo hoje',
      counted: false,
    });
  });
});
