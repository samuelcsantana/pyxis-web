export const CARRIED_REFERRER_KEY = 'pyxis:carried-referrer';

export type CarriedReferrerStore = Pick<Storage, 'getItem' | 'removeItem'>;

const browserVisitStore = (): CarriedReferrerStore => window.sessionStorage;

export function bestEffortTakeCarriedReferrer(
  store: () => CarriedReferrerStore = browserVisitStore,
): string | undefined {
  try {
    const carried = store().getItem(CARRIED_REFERRER_KEY);
    store().removeItem(CARRIED_REFERRER_KEY);
    return carried ?? undefined;
  } catch (error) {
    console.warn(
      'landing: could not read the referrer carried from the page that moved here',
      error,
    );
    return undefined;
  }
}
