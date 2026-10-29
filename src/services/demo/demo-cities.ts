import { type Random, weightedPick } from './demo-random';

type DemoCity = readonly [name: string, weight: number];

export const UNKNOWN_CITY_SHARE = 0.1;

const CITIES_OF_REGION: Readonly<Record<string, readonly DemoCity[]>> = {
  'BR-SP': [
    ['São Paulo', 50],
    ['Campinas', 12],
    ['Guarulhos', 8],
    ['Santos', 8],
    ['Ribeirão Preto', 8],
    ['São José dos Campos', 7],
    ['Sorocaba', 7],
  ],
  'BR-RJ': [
    ['Rio de Janeiro', 65],
    ['Niterói', 15],
    ['Duque de Caxias', 8],
    ['Petrópolis', 6],
    ['Nova Iguaçu', 6],
  ],
  'BR-MG': [
    ['Belo Horizonte', 55],
    ['Juiz de Fora', 18],
    ['Uberlândia', 15],
    ['Contagem', 12],
  ],
  'BR-PR': [
    ['Curitiba', 60],
    ['Londrina', 20],
    ['Maringá', 20],
  ],
  'BR-RS': [
    ['Porto Alegre', 60],
    ['Caxias do Sul', 20],
    ['Pelotas', 20],
  ],
  'BR-BA': [
    ['Salvador', 60],
    ['Feira de Santana', 25],
    ['Vitória da Conquista', 15],
  ],
  'BR-SC': [
    ['Florianópolis', 40],
    ['Joinville', 35],
    ['Blumenau', 25],
  ],
  'BR-PE': [
    ['Recife', 65],
    ['Caruaru', 20],
    ['Olinda', 15],
  ],
  'BR-CE': [
    ['Fortaleza', 80],
    ['Juazeiro do Norte', 20],
  ],
  'BR-GO': [
    ['Goiânia', 75],
    ['Anápolis', 25],
  ],
  'BR-DF': [['Brasília', 100]],
  'BR-ES': [
    ['Vitória', 45],
    ['Vila Velha', 35],
    ['Serra', 20],
  ],
  'BR-PA': [
    ['Belém', 80],
    ['Ananindeua', 20],
  ],
  'BR-AM': [['Manaus', 100]],
  'PT-11': [
    ['Lisboa', 60],
    ['Sintra', 15],
    ['Cascais', 15],
    ['Amadora', 10],
  ],
  'PT-13': [
    ['Porto', 60],
    ['Vila Nova de Gaia', 25],
    ['Matosinhos', 15],
  ],
  'PT-03': [
    ['Braga', 70],
    ['Guimarães', 30],
  ],
  'PT-08': [
    ['Faro', 50],
    ['Albufeira', 25],
    ['Portimão', 25],
  ],
  'US-CA': [
    ['Los Angeles', 30],
    ['San Francisco', 30],
    ['San Diego', 20],
    ['San Jose', 20],
  ],
  'US-NY': [
    ['New York', 80],
    ['Buffalo', 10],
    ['Rochester', 10],
  ],
  'US-TX': [
    ['Austin', 35],
    ['Houston', 35],
    ['Dallas', 30],
  ],
  'US-FL': [
    ['Miami', 45],
    ['Orlando', 30],
    ['Tampa', 25],
  ],
  'US-MA': [
    ['Boston', 70],
    ['Cambridge', 30],
  ],
  'AR-C': [['Buenos Aires', 100]],
  'AR-B': [
    ['La Plata', 45],
    ['Mar del Plata', 35],
    ['Bahía Blanca', 20],
  ],
  'AR-X': [
    ['Córdoba', 80],
    ['Villa Carlos Paz', 20],
  ],
  'ES-MD': [
    ['Madrid', 85],
    ['Alcalá de Henares', 15],
  ],
  'ES-CT': [
    ['Barcelona', 75],
    ['Girona', 15],
    ['Tarragona', 10],
  ],
  'ES-AN': [
    ['Sevilla', 45],
    ['Málaga', 40],
    ['Granada', 15],
  ],
  'DE-BE': [['Berlin', 100]],
  'DE-BY': [
    ['München', 70],
    ['Nürnberg', 30],
  ],
  'DE-HH': [['Hamburg', 100]],
  'MX-CMX': [['Ciudad de México', 100]],
  'MX-JAL': [
    ['Guadalajara', 75],
    ['Zapopan', 25],
  ],
  'CL-RM': [
    ['Santiago', 85],
    ['Puente Alto', 15],
  ],
  'CL-VS': [
    ['Valparaíso', 50],
    ['Viña del Mar', 50],
  ],
  'FR-IDF': [
    ['Paris', 85],
    ['Boulogne-Billancourt', 15],
  ],
  'FR-ARA': [
    ['Lyon', 70],
    ['Grenoble', 30],
  ],
  'IT-25': [
    ['Milano', 80],
    ['Bergamo', 20],
  ],
  'IT-62': [['Roma', 100]],
  'GB-ENG': [
    ['London', 60],
    ['Manchester', 20],
    ['Bristol', 20],
  ],
  'GB-SCT': [
    ['Edinburgh', 55],
    ['Glasgow', 45],
  ],
  'CO-DC': [['Bogotá', 100]],
  'CO-ANT': [
    ['Medellín', 85],
    ['Envigado', 15],
  ],
};

export function demoCitiesOf(region: string | null): readonly DemoCity[] {
  return (region === null ? undefined : CITIES_OF_REGION[region]) ?? [];
}

export function demoCityFor(region: string | null, random: Random): string | null {
  const unknown = random() < UNKNOWN_CITY_SHARE;
  const city = weightedPick(demoCitiesOf(region), ([, weight]) => weight, random);
  return unknown || city === undefined ? null : city[0];
}
