import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BUDGET_KIB,
  formatReport,
  overBudget,
  parseStats,
  routeClassOf,
  routeSizes,
} from './check-bundle-budget.mts';

const KIB = 1024;

const STATS = [
  { route: '/sign-in', firstLoadChunkPaths: ['.next\\static\\chunks\\framework.js'] },
  {
    route: '/[projectId]/devices',
    firstLoadChunkPaths: ['.next/static/chunks/framework.js', '.next/static/chunks/devices.js'],
  },
  {
    route: '/[projectId]/overview',
    firstLoadChunkPaths: ['.next/static/chunks/framework.js', '.next/static/chunks/charts.js'],
  },
];

const CHUNK_KIB: Readonly<Record<string, number>> = {
  framework: 130,
  devices: 20,
  charts: 120,
};

function fakeGzipBytes(chunkPath: string): number {
  const name = chunkPath.split(/[\\/]/).at(-1)?.replace('.js', '') ?? '';
  return (CHUNK_KIB[name] ?? 0) * KIB;
}

describe('routeClassOf', () => {
  it('tells the routes with a chart, the other dashboard screens and the entry pages apart', () => {
    assert.equal(routeClassOf('/[projectId]/overview'), 'chart');
    assert.equal(routeClassOf('/[projectId]/acquisition'), 'chart');
    assert.equal(routeClassOf('/[projectId]/visits'), 'screen');
    assert.equal(routeClassOf('/sign-in'), 'entry');
    assert.equal(routeClassOf('/'), 'entry');
    assert.equal(routeClassOf('/_not-found'), 'entry');
  });
});

describe('parseStats', () => {
  it('reads the first-load chunks of each route', () => {
    assert.deepEqual(parseStats(JSON.stringify(STATS)), STATS);
  });

  it('fails loudly on a file in another shape, instead of passing', () => {
    for (const text of [
      '{}',
      '[]',
      '[null]',
      '[{"route":"/"}]',
      '[{"route":"/","firstLoadChunkPaths":[1]}]',
    ]) {
      assert.throws(() => parseStats(text), /does not list the first-load chunks/);
    }
  });
});

describe('routeSizes and overBudget', () => {
  it('adds the gzip size of every first-load chunk of a route and gives it its budget', () => {
    assert.deepEqual(routeSizes(STATS, fakeGzipBytes), [
      {
        route: '/sign-in',
        routeClass: 'entry',
        gzipBytes: 130 * KIB,
        budgetBytes: BUDGET_KIB.entry * KIB,
      },
      {
        route: '/[projectId]/devices',
        routeClass: 'screen',
        gzipBytes: 150 * KIB,
        budgetBytes: BUDGET_KIB.screen * KIB,
      },
      {
        route: '/[projectId]/overview',
        routeClass: 'chart',
        gzipBytes: 250 * KIB,
        budgetBytes: BUDGET_KIB.chart * KIB,
      },
    ]);
    assert.deepEqual(overBudget(routeSizes(STATS, fakeGzipBytes)), []);
  });

  it('reports a route over its budget', () => {
    const heavy = routeSizes(STATS, (chunk) =>
      chunk.endsWith('devices.js') ? 100 * KIB : fakeGzipBytes(chunk),
    );

    assert.deepEqual(
      overBudget(heavy).map((size) => size.route),
      ['/[projectId]/devices'],
    );
  });

  it('accepts a route exactly at its budget', () => {
    const exact = routeSizes(
      [{ route: '/sign-in', firstLoadChunkPaths: ['.next/static/chunks/framework.js'] }],
      () => BUDGET_KIB.entry * KIB,
    );

    assert.deepEqual(overBudget(exact), []);
  });
});

describe('formatReport', () => {
  it('lists the heaviest route first and marks the ones over budget', () => {
    const report = formatReport(
      routeSizes(STATS, (chunk) =>
        chunk.endsWith('devices.js') ? 100 * KIB : fakeGzipBytes(chunk),
      ),
    ).split('\n');

    assert.equal(report[0], 'Route | class | first-load JS, KiB gzip | budget, KiB');
    assert.equal(
      report[1],
      `/[projectId]/overview | chart | 250.0 | ${BUDGET_KIB.chart.toFixed(1)}`,
    );
    assert.equal(
      report[2],
      `/[projectId]/devices | screen | 230.0 | ${BUDGET_KIB.screen.toFixed(1)} | OVER BUDGET`,
    );
    assert.equal(report[3], `/sign-in | entry | 130.0 | ${BUDGET_KIB.entry.toFixed(1)}`);
  });
});
