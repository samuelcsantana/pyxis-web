import { afterEach, describe, expect, it, vi } from 'vitest';
import { legalConfig, legalConfigOf, TERMS_VERSION } from './legal-config';

const SELLER_ENVIRONMENT = {
  SELLER_NAME: 'Ana Exemplo',
  SELLER_TAX_ID: '000.000.000-00',
  SELLER_ADDRESS: 'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000',
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('legal configuration', () => {
  it('names version 1.2, the label printed on the documents and accepted at sign-up', () => {
    expect(TERMS_VERSION).toBe('1.2');
  });

  it('reads the seller and the effective date, trimmed', () => {
    expect(
      legalConfigOf({
        SELLER_NAME: '  Ana Exemplo ',
        SELLER_TAX_ID: SELLER_ENVIRONMENT.SELLER_TAX_ID,
        SELLER_ADDRESS: SELLER_ENVIRONMENT.SELLER_ADDRESS,
        TERMS_EFFECTIVE_DATE: ' 2026-10-20 ',
      }),
    ).toEqual({
      seller: {
        name: 'Ana Exemplo',
        taxId: '000.000.000-00',
        address: 'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000',
      },
      effectiveFrom: '2026-10-20',
    });
  });

  it('is absent while any part of the seller is missing or blank', () => {
    expect(legalConfigOf({})).toBeNull();
    expect(legalConfigOf({ ...SELLER_ENVIRONMENT, SELLER_NAME: ' ' })).toBeNull();
    expect(legalConfigOf({ ...SELLER_ENVIRONMENT, SELLER_TAX_ID: undefined })).toBeNull();
    expect(legalConfigOf({ ...SELLER_ENVIRONMENT, SELLER_ADDRESS: '' })).toBeNull();
  });

  it('leaves the effective date open when it is missing, malformed or not a real day', () => {
    expect(legalConfigOf(SELLER_ENVIRONMENT)?.effectiveFrom).toBeNull();
    expect(
      legalConfigOf({ ...SELLER_ENVIRONMENT, TERMS_EFFECTIVE_DATE: '20/10/2026' })?.effectiveFrom,
    ).toBeNull();
    expect(
      legalConfigOf({ ...SELLER_ENVIRONMENT, TERMS_EFFECTIVE_DATE: '2026-02-30' })?.effectiveFrom,
    ).toBeNull();
  });

  it('reads the server environment', () => {
    vi.stubEnv('SELLER_NAME', SELLER_ENVIRONMENT.SELLER_NAME);
    vi.stubEnv('SELLER_TAX_ID', SELLER_ENVIRONMENT.SELLER_TAX_ID);
    vi.stubEnv('SELLER_ADDRESS', SELLER_ENVIRONMENT.SELLER_ADDRESS);
    vi.stubEnv('TERMS_EFFECTIVE_DATE', '');

    expect(legalConfig()?.seller.name).toBe('Ana Exemplo');
  });
});
