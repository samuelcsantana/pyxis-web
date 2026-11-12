import { describe, expect, it } from 'vitest';
import { liveDemoIsOpen } from './live-demo';

describe('liveDemoIsOpen', () => {
  it('keeps every link to the live demo hidden while the demo is offline', () => {
    expect(liveDemoIsOpen()).toBe(false);
  });
});
