import { type Random, weightedPick } from './demo-random';

export interface DemoPlace {
  readonly region: string | null;
  readonly regionName: string | null;
}

type DemoRegion = readonly [code: string, name: string, weight: number];

export type DemoContinent = 'africa' | 'americas' | 'asia' | 'europe' | 'oceania';

export const UNKNOWN_REGION_SHARE = 0.03;

const NO_REGION: DemoPlace = { region: null, regionName: null };

const REGIONS_OF_COUNTRY: Readonly<Record<string, readonly DemoRegion[]>> = {
  BR: [
    ['BR-SP', 'São Paulo', 32],
    ['BR-RJ', 'Rio de Janeiro', 13],
    ['BR-MG', 'Minas Gerais', 11],
    ['BR-PR', 'Paraná', 7],
    ['BR-RS', 'Rio Grande do Sul', 7],
    ['BR-BA', 'Bahia', 6],
    ['BR-SC', 'Santa Catarina', 5],
    ['BR-PE', 'Pernambuco', 4],
    ['BR-CE', 'Ceará', 4],
    ['BR-GO', 'Goiás', 3],
    ['BR-DF', 'Distrito Federal', 3],
    ['BR-ES', 'Espírito Santo', 2],
    ['BR-PA', 'Pará', 2],
    ['BR-AM', 'Amazonas', 1],
  ],
  PT: [
    ['PT-11', 'Lisboa', 45],
    ['PT-13', 'Porto', 30],
    ['PT-03', 'Braga', 15],
    ['PT-08', 'Faro', 10],
  ],
  US: [
    ['US-CA', 'California', 30],
    ['US-NY', 'New York', 25],
    ['US-TX', 'Texas', 20],
    ['US-FL', 'Florida', 15],
    ['US-MA', 'Massachusetts', 10],
  ],
  AR: [
    ['AR-C', 'Ciudad Autónoma de Buenos Aires', 50],
    ['AR-B', 'Buenos Aires', 30],
    ['AR-X', 'Córdoba', 20],
  ],
  ES: [
    ['ES-MD', 'Comunidad de Madrid', 40],
    ['ES-CT', 'Cataluña', 35],
    ['ES-AN', 'Andalucía', 25],
  ],
  DE: [
    ['DE-BE', 'Berlin', 40],
    ['DE-BY', 'Bayern', 35],
    ['DE-HH', 'Hamburg', 25],
  ],
  MX: [
    ['MX-CMX', 'Ciudad de México', 60],
    ['MX-JAL', 'Jalisco', 40],
  ],
  CL: [
    ['CL-RM', 'Región Metropolitana de Santiago', 80],
    ['CL-VS', 'Valparaíso', 20],
  ],
  FR: [
    ['FR-IDF', 'Île-de-France', 65],
    ['FR-ARA', 'Auvergne-Rhône-Alpes', 35],
  ],
  IT: [
    ['IT-25', 'Lombardia', 55],
    ['IT-62', 'Lazio', 45],
  ],
  GB: [
    ['GB-ENG', 'England', 85],
    ['GB-SCT', 'Scotland', 15],
  ],
  CO: [
    ['CO-DC', 'Bogotá', 60],
    ['CO-ANT', 'Antioquia', 40],
  ],
};

const CONTINENT_OF_COUNTRY: Readonly<Record<string, DemoContinent>> = {
  AR: 'americas',
  BR: 'americas',
  CL: 'americas',
  CO: 'americas',
  MX: 'americas',
  US: 'americas',
  DE: 'europe',
  ES: 'europe',
  FR: 'europe',
  GB: 'europe',
  IT: 'europe',
  PT: 'europe',
};

export function demoContinentOf(country: string): DemoContinent | null {
  return CONTINENT_OF_COUNTRY[country] ?? null;
}

export function demoRegionsOf(country: string): readonly DemoRegion[] {
  return REGIONS_OF_COUNTRY[country] ?? [];
}

export function demoPlaceFor(country: string, random: Random): DemoPlace {
  const unknown = random() < UNKNOWN_REGION_SHARE;
  const region = weightedPick(demoRegionsOf(country), ([, , weight]) => weight, random);
  if (unknown || region === undefined) {
    return NO_REGION;
  }
  const [code, name] = region;
  return { region: code, regionName: name };
}
