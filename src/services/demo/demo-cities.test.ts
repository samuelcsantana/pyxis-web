import { describe, expect, it } from 'vitest';
import { demoCitiesOf, demoCityFor, UNKNOWN_CITY_SHARE } from './demo-cities';
import { demoRegionsOf } from './demo-regions';

const DEMO_COUNTRIES = ['BR', 'PT', 'US', 'AR', 'ES', 'DE', 'MX', 'CL', 'FR', 'IT', 'GB', 'CO'];

function answering(...values: readonly number[]) {
  const queue = [...values];
  return () => queue.shift() ?? 0;
}

describe('demoCityFor', () => {
  it('draws a city of the region by its weight', () => {
    expect(demoCityFor('BR-SP', answering(UNKNOWN_CITY_SHARE, 0))).toBe('São Paulo');
    expect(demoCityFor('PT-08', answering(0.5, 0.99))).toBe('Portimão');
    expect(demoCityFor('BR-BA', answering(0.5, 0.7))).toBe('Feira de Santana');
  });

  it('leaves about one visit in ten without a city, as an address the network cannot place', () => {
    expect(demoCityFor('BR-SP', answering(0, 0))).toBeNull();
  });

  it('gives no city to a visit without a region, or in a region it has no cities for', () => {
    expect(demoCitiesOf(null)).toEqual([]);
    expect(demoCityFor(null, answering(0.5, 0.5))).toBeNull();
    expect(demoCitiesOf('NZ-AUK')).toEqual([]);
    expect(demoCityFor('NZ-AUK', answering(0.5, 0.5))).toBeNull();
  });

  it('has real cities for every region the demo places visits in', () => {
    for (const country of DEMO_COUNTRIES) {
      for (const [region] of demoRegionsOf(country)) {
        expect(demoCitiesOf(region).length, region).toBeGreaterThan(0);
      }
    }
  });
});
