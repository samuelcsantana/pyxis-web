import { expect, type Locator } from '@playwright/test';

const REACT_FIBER_KEY = '__reactFiber$';
const HYDRATION_TIMEOUT_MS = 15_000;

export async function untilHydrated(locator: Locator): Promise<void> {
  await expect
    .poll(
      () =>
        locator.evaluate(
          (element, prefix) => Object.keys(element).some((key) => key.startsWith(prefix)),
          REACT_FIBER_KEY,
        ),
      { timeout: HYDRATION_TIMEOUT_MS },
    )
    .toBe(true);
}
