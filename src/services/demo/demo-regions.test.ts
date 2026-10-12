import { describe, expect, it } from 'vitest';
import { demoPlaceFor, demoRegionsOf, UNKNOWN_REGION_SHARE } from './demo-regions';

function answering(...values: readonly number[]) {
  const queue = [...values];
  return () => queue.shift() ?? 0;
}

describe('demoPlaceFor', () => {
  it('draws a region of the country by its weight', () => {
    expect(demoPlaceFor('BR', answering(UNKNOWN_REGION_SHARE, 0))).toEqual({
      region: 'BR-SP',
      regionName: 'São Paulo',
    });
    expect(demoPlaceFor('PT', answering(0.5, 0.99))).toEqual({
      region: 'PT-08',
      regionName: 'Faro',
    });
  });

  it('leaves a few visits without a region, as an address the network cannot place', () => {
    expect(demoPlaceFor('BR', answering(0, 0))).toEqual({ region: null, regionName: null });
  });

  it('leaves a country it has no regions for without one', () => {
    expect(demoRegionsOf('NZ')).toEqual([]);
    expect(demoPlaceFor('NZ', answering(0.5, 0.5))).toEqual({ region: null, regionName: null });
  });

  it('writes every region as the country code, a dash and up to three letters or digits', () => {
    for (const country of [
      'BR',
      'PT',
      'US',
      'AR',
      'ES',
      'DE',
      'MX',
      'CL',
      'FR',
      'IT',
      'GB',
      'CO',
    ]) {
      for (const [code] of demoRegionsOf(country)) {
        expect(code).toMatch(new RegExp(`^${country}-[A-Z0-9]{1,3}$`));
      }
    }
  });
});
