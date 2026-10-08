import { describe, expect, it } from 'vitest';
import { identifierSegments } from './identifier-segments';

describe('identifierSegments', () => {
  it('cuts an identifier after each separator, so a line breaks between its tokens', () => {
    expect(identifierSegments('/orders/:id')).toEqual(['/', 'orders/', ':', 'id']);
    expect(identifierSegments('error_code=order_number_in_use')).toEqual([
      'error_',
      'code=',
      'order_',
      'number_',
      'in_',
      'use',
    ]);
    expect(identifierSegments('blog.example-site.com')).toEqual([
      'blog.',
      'example-',
      'site.',
      'com',
    ]);
  });

  it('keeps text without a separator whole, and gives nothing for an empty text', () => {
    expect(identifierSegments('Organic search')).toEqual(['Organic search']);
    expect(identifierSegments('')).toEqual([]);
  });
});
