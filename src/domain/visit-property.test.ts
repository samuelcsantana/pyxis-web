import { describe, expect, it } from 'vitest';
import { propertyFilterOf } from './visit-property';
import { visitFiltersOf } from './visits';

describe('propertyFilterOf', () => {
  it('writes a property value as the filter Visits reads back', () => {
    const property = propertyFilterOf('plan', 'pro=yearly');

    expect(property).toBe('plan=pro=yearly');
    expect(
      visitFiltersOf({ event: 'plan_chosen', property: property ?? '' }).filters.property,
    ).toBe(property);
  });

  it('gives no filter for a value the API could not match', () => {
    expect(propertyFilterOf('Plan', 'pro')).toBeNull();
    expect(propertyFilterOf('plan', '')).toBeNull();
    expect(propertyFilterOf('plan', 'x'.repeat(101))).toBeNull();
    expect(propertyFilterOf('plan', 'x'.repeat(100))).toBe(`plan=${'x'.repeat(100)}`);
  });
});
