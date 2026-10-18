import { afterEach, describe, expect, it, vi } from 'vitest';
import { bestEffortTakeCarriedReferrer, CARRIED_REFERRER_KEY } from './carried-referrer';

describe('bestEffortTakeCarriedReferrer', () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('hands over the referrer carried from the page that moved here, once', () => {
    window.sessionStorage.setItem(CARRIED_REFERRER_KEY, 'https://www.linkedin.com/');

    expect(bestEffortTakeCarriedReferrer()).toBe('https://www.linkedin.com/');
    expect(bestEffortTakeCarriedReferrer()).toBeUndefined();
  });

  it('hands over an empty referrer, which stands for a direct visit', () => {
    window.sessionStorage.setItem(CARRIED_REFERRER_KEY, '');

    expect(bestEffortTakeCarriedReferrer()).toBe('');
  });

  it('has nothing to hand over when no page moved the visitor', () => {
    expect(bestEffortTakeCarriedReferrer()).toBeUndefined();
  });

  it('has nothing to hand over when the browser blocks storage, saying why in the console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const blocked = () => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    };

    expect(bestEffortTakeCarriedReferrer(blocked)).toBeUndefined();
    expect(warn).toHaveBeenCalledOnce();
  });
});
