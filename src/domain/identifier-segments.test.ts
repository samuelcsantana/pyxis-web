import { describe, expect, it } from 'vitest';
import { identifierSegments, slashSegments } from './identifier-segments';

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

describe('slashSegments', () => {
  it('cuts a text only after its slashes, keeping words joined by other separators whole', () => {
    expect(slashSegments('America/Argentina/Buenos_Aires')).toEqual([
      'America/',
      'Argentina/',
      'Buenos_Aires',
    ]);
    expect(slashSegments('Etc/GMT-3')).toEqual(['Etc/', 'GMT-3']);
  });

  it('keeps text without a slash whole, and gives nothing for an empty text', () => {
    expect(slashSegments('UTC')).toEqual(['UTC']);
    expect(slashSegments('')).toEqual([]);
  });
});
