import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

export type RouteClass = 'entry' | 'screen' | 'chart';

export interface RouteStats {
  readonly route: string;
  readonly firstLoadChunkPaths: readonly string[];
}

export interface RouteSize {
  readonly route: string;
  readonly routeClass: RouteClass;
  readonly gzipBytes: number;
  readonly budgetBytes: number;
}

const BYTES_PER_KIB = 1024;
const GZIP_LEVEL = 9;
const STATS_FILE = '.next/diagnostics/route-bundle-stats.json';
const PROJECT_ROUTE_PREFIX = '/[projectId]/';
const CHART_ROUTES: ReadonlySet<string> = new Set([
  '/[projectId]/overview',
  '/[projectId]/acquisition',
]);

export const BUDGET_KIB: Readonly<Record<RouteClass, number>> = {
  entry: 152,
  screen: 161,
  chart: 162,
};

export function routeClassOf(route: string): RouteClass {
  if (CHART_ROUTES.has(route)) {
    return 'chart';
  }
  return route.startsWith(PROJECT_ROUTE_PREFIX) ? 'screen' : 'entry';
}

function isRouteStats(entry: unknown): entry is RouteStats {
  if (typeof entry !== 'object' || entry === null) {
    return false;
  }
  const { route, firstLoadChunkPaths } = entry as Record<string, unknown>;
  return (
    typeof route === 'string' &&
    Array.isArray(firstLoadChunkPaths) &&
    firstLoadChunkPaths.every((chunk) => typeof chunk === 'string')
  );
}

export function parseStats(text: string): readonly RouteStats[] {
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isRouteStats)) {
    throw new Error(`${STATS_FILE} does not list the first-load chunks of each route.`);
  }
  return parsed;
}

export function routeSizes(
  stats: readonly RouteStats[],
  gzipBytesOf: (chunkPath: string) => number,
): readonly RouteSize[] {
  return stats.map(({ route, firstLoadChunkPaths }) => {
    const routeClass = routeClassOf(route);
    return {
      route,
      routeClass,
      gzipBytes: firstLoadChunkPaths.reduce((sum, chunk) => sum + gzipBytesOf(chunk), 0),
      budgetBytes: BUDGET_KIB[routeClass] * BYTES_PER_KIB,
    };
  });
}

export function overBudget(sizes: readonly RouteSize[]): readonly RouteSize[] {
  return sizes.filter((size) => size.gzipBytes > size.budgetBytes);
}

function kib(bytes: number): string {
  return (bytes / BYTES_PER_KIB).toFixed(1);
}

export function formatReport(sizes: readonly RouteSize[]): string {
  const rows = sizes
    .toSorted((first, second) => second.gzipBytes - first.gzipBytes)
    .map(
      (size) =>
        `${size.route} | ${size.routeClass} | ${kib(size.gzipBytes)} | ${kib(size.budgetBytes)}${
          size.gzipBytes > size.budgetBytes ? ' | OVER BUDGET' : ''
        }`,
    );
  return ['Route | class | first-load JS, KiB gzip | budget, KiB', ...rows].join('\n');
}

function gzipBytesReader(root: string): (chunkPath: string) => number {
  const cache = new Map<string, number>();
  return (chunkPath) => {
    const file = path.join(root, chunkPath.replaceAll('\\', '/'));
    const known = cache.get(file);
    if (known !== undefined) {
      return known;
    }
    const bytes = gzipSync(readFileSync(file), { level: GZIP_LEVEL }).length;
    cache.set(file, bytes);
    return bytes;
  };
}

function main(): void {
  const root = process.cwd();
  const statsFile = path.join(root, STATS_FILE);
  if (!existsSync(statsFile)) {
    console.error(`${STATS_FILE} is missing: run "npm run build" first.`);
    process.exitCode = 1;
    return;
  }
  const sizes = routeSizes(parseStats(readFileSync(statsFile, 'utf8')), gzipBytesReader(root));
  console.log(formatReport(sizes));
  const over = overBudget(sizes);
  if (over.length > 0) {
    console.error(
      `\n${String(over.length)} route(s) over the first-load JavaScript budget: ${over.map((size) => size.route).join(', ')}. Raise a budget only in a pull request that says why.`,
    );
    process.exitCode = 1;
  }
}

if (import.meta.main) {
  main();
}
