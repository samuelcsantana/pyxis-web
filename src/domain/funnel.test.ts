import { describe, expect, it } from 'vitest';
import {
  biggestDropOff,
  countedSteps,
  EVENT_NAME_PATTERN,
  type FunnelStep,
  funnelModeOf,
  funnelRows,
  isCountableFunnel,
  MAX_FUNNEL_STEPS,
  MAX_PATH_LENGTH,
  MIN_FUNNEL_STEPS,
  overallConversion,
  serializeSteps,
  stepLabel,
  stepProblem,
  stepTarget,
  timeToFinish,
} from './funnel';
import { funnelResponseSchema, funnelStepsOf, funnelStepsSchema } from './funnel.schema';
import { english } from '@/test-utils/english';

const CALCULATOR: FunnelStep = { type: 'page', path: '/calculator' };
const RESULT: FunnelStep = { type: 'event', name: 'calculator_result_shown' };
const SIGN_UP: FunnelStep = { type: 'page', path: '/sign-up' };

describe('the limits copied from the API', () => {
  it('match pyxis-api: event names, path length and the number of steps', () => {
    expect(EVENT_NAME_PATTERN.source).toBe('^[a-z][a-z0-9_]{0,63}$');
    expect(MAX_PATH_LENGTH).toBe(256);
    expect(MIN_FUNNEL_STEPS).toBe(2);
    expect(MAX_FUNNEL_STEPS).toBe(8);
  });
});

describe('funnelStepsOf', () => {
  it('reads the steps a URL carries as JSON', () => {
    expect(funnelStepsOf({ steps: serializeSteps([CALCULATOR, RESULT]) })).toEqual([
      CALCULATOR,
      RESULT,
    ]);
  });

  it('ignores anything the API would refuse', () => {
    const one = serializeSteps([CALCULATOR]);
    const nine = serializeSteps(Array.from({ length: 9 }, () => RESULT));
    expect(funnelStepsOf({ steps: '{not json' })).toBeNull();
    expect(funnelStepsOf({ steps: one })).toBeNull();
    expect(funnelStepsOf({ steps: nine })).toBeNull();
    expect(
      funnelStepsOf({ steps: '[{"type":"page","path":"calculator"},{"type":"page","path":"/"}]' }),
    ).toBeNull();
    expect(
      funnelStepsOf({ steps: '[{"type":"event","name":"Signed Up"},{"type":"page","path":"/"}]' }),
    ).toBeNull();
    expect(funnelStepsOf({ steps: ['[]', '[]'] })).toBeNull();
    expect(funnelStepsOf({})).toBeNull();
  });
});

describe('funnelModeOf', () => {
  it('counts per visit unless per person is asked for', () => {
    expect(funnelModeOf({ mode: 'user' })).toBe('user');
    expect(funnelModeOf({ mode: 'session' })).toBe('visit');
    expect(funnelModeOf({})).toBe('visit');
  });
});

describe('step labels and problems', () => {
  it('names a page step by its path and an event step in words', () => {
    expect(stepLabel(CALCULATOR, english)).toBe('Opened /calculator');
    expect(stepLabel(RESULT, english)).toBe('Calculator result shown');
    expect(stepTarget(CALCULATOR)).toBe('/calculator');
    expect(stepTarget(RESULT)).toBe('calculator_result_shown');
  });

  it('finds the problems the API schema would find, and nothing more', () => {
    const steps: FunnelStep[] = [
      CALCULATOR,
      RESULT,
      { type: 'page', path: 'calculator' },
      { type: 'page', path: `/${'x'.repeat(256)}` },
      { type: 'event', name: 'Signed_up' },
      { type: 'event', name: '' },
      { type: 'page', path: '/blog/*' },
    ];
    for (const step of steps) {
      const accepted = funnelStepsSchema.safeParse([step, CALCULATOR]).success;
      expect(stepProblem(step, english.t) === null, JSON.stringify(step)).toBe(accepted);
    }
    expect(stepProblem({ type: 'page', path: 'x' }, english.t)).toBe(
      'A page path starts with "/".',
    );
    expect(stepProblem({ type: 'page', path: `/${'x'.repeat(256)}` }, english.t)).toBe(
      'A page path has at most 256 characters.',
    );
  });
});

describe('isCountableFunnel', () => {
  it.each<[string, readonly FunnelStep[], boolean]>([
    ['one step', [CALCULATOR], false],
    ['nine steps', Array.from({ length: 9 }, () => CALCULATOR), false],
    ['a path without a slash', [CALCULATOR, { type: 'page', path: 'pricing' }], false],
    ['a path too long', [CALCULATOR, { type: 'page', path: `/${'x'.repeat(256)}` }], false],
    ['a bad event name', [CALCULATOR, { type: 'event', name: 'Signed_up' }], false],
    ['two to eight valid steps', [CALCULATOR, RESULT, SIGN_UP], true],
    ['eight valid steps', Array.from({ length: 8 }, () => RESULT), true],
  ])('says whether %s can be counted, as the API schema does', (_label, steps, countable) => {
    expect(isCountableFunnel(steps)).toBe(countable);
    expect(funnelStepsSchema.safeParse(steps).success).toBe(countable);
  });
});

describe('funnelRows', () => {
  it('shows each step with its count, the share that continued and the drop-off', () => {
    const rows = funnelRows(
      countedSteps([CALCULATOR, RESULT, SIGN_UP], {
        steps: [{ count: 1940 }, { count: 1212 }, { count: 498 }],
      }),
      english,
    );

    expect(rows[0]).toEqual({
      key: '0-page-/calculator',
      position: 1,
      label: 'Opened /calculator',
      target: '/calculator',
      count: '1,940',
      barWidth: '100.0%',
      continued: 'Start',
      tone: 'start',
      dropped: '',
      time: null,
      reachedLink: null,
      droppedLink: null,
    });
    expect(rows[1]).toMatchObject({
      continued: '62.5% continued',
      tone: 'good',
      dropped: '728 dropped',
    });
    expect(rows[2]).toMatchObject({ continued: '41.1% continued', tone: 'bad', barWidth: '25.7%' });
  });

  it('shows dashes when a step had nobody, and zero for a step the API did not count', () => {
    const rows = funnelRows(
      countedSteps([CALCULATOR, RESULT, SIGN_UP], { steps: [{ count: 0 }, { count: 0 }] }),
      english,
    );

    expect(rows[1]).toMatchObject({ continued: '— continued', tone: 'neutral' });
    expect(rows[2]?.count).toBe('0');
    expect(funnelRows([], english)).toEqual([]);
  });
});

describe('step times', () => {
  it('reads the median time of each step and of the whole funnel, or none from an older API', () => {
    const report = funnelResponseSchema.parse({
      steps: [
        { count: 1940, median_seconds_from_previous: null },
        { count: 1212, median_seconds_from_previous: 79 },
      ],
      median_seconds_overall: 79,
    });

    expect(report).toEqual({
      steps: [
        { count: 1940, medianSecondsFromPrevious: null },
        { count: 1212, medianSecondsFromPrevious: 79 },
      ],
      medianSecondsOverall: 79,
    });
    expect(funnelResponseSchema.parse({ steps: [{ count: 3 }] })).toEqual({
      steps: [{ count: 3, medianSecondsFromPrevious: null }],
      medianSecondsOverall: null,
    });
  });

  it('gives each step after the first its median time after the step before', () => {
    const rows = funnelRows(
      countedSteps([CALCULATOR, RESULT], {
        steps: [
          { count: 1940, medianSecondsFromPrevious: null },
          { count: 1212, medianSecondsFromPrevious: 79 },
        ],
      }),
      english,
    );

    expect(rows.map((row) => row.time)).toEqual([null, 'median 1 min 19 s after the step before']);
  });

  it('gives the median time to finish only when the API measured it', () => {
    expect(timeToFinish(3725, 3, english)).toEqual({
      value: '1 h 2 min',
      note: 'from step 1 to step 3, for those who reached it',
    });
    expect(timeToFinish(null, 3, english)).toBeNull();
  });
});

describe('figures', () => {
  const counted = countedSteps([CALCULATOR, RESULT, SIGN_UP], {
    steps: [{ count: 1940 }, { count: 1212 }, { count: 498 }],
  });

  it('give the share of the first step that reached the last one, with the totals', () => {
    expect(overallConversion(counted, 'visit', english)).toEqual({
      value: '25.7%',
      note: '498 of 1,940 visits reached the last step',
    });
    expect(overallConversion(counted, 'user', english).note).toBe(
      '498 of 1,940 people reached the last step',
    );
    expect(overallConversion([], 'visit', english).value).toBe('—');
  });

  it('name the transition where the fewest continued', () => {
    expect(biggestDropOff(counted, english)).toEqual({
      value: 'Step 2 → 3',
      note: 'Calculator result shown → Opened /sign-up · 41.1% continued',
    });
    expect(
      biggestDropOff(
        countedSteps([CALCULATOR, RESULT, SIGN_UP], {
          steps: [{ count: 0 }, { count: 0 }, { count: 0 }],
        }),
        english,
      ).note,
    ).toBe('Opened /calculator → Calculator result shown · — continued');
    expect(biggestDropOff([], english)).toEqual({ value: '—', note: 'No step to compare' });
  });
});
