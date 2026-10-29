import { z } from 'zod';

const valueShareSchema = z
  .object({
    value: z.string(),
    visits: z.number(),
    conversions: z.number().nullable(),
    converting_visits: z.number().nullable().optional(),
  })
  .transform((share) => ({
    value: share.value,
    visits: share.visits,
    conversions: share.conversions,
    convertingVisits: share.converting_visits ?? null,
  }));

const regionShareSchema = z
  .object({
    value: z.string().nullable(),
    name: z.string().nullable(),
    visits: z.number(),
    conversions: z.number().nullable(),
    converting_visits: z.number().nullable(),
  })
  .transform((share) => ({
    value: share.value,
    name: share.name,
    visits: share.visits,
    conversions: share.conversions,
    convertingVisits: share.converting_visits,
  }));

const cityShareSchema = z
  .object({
    value: z.string().nullable(),
    region: z.string().nullable(),
    region_name: z.string().nullable(),
    visits: z.number(),
    conversions: z.number().nullable(),
    converting_visits: z.number().nullable(),
  })
  .transform((share) => ({
    value: share.value,
    region: share.region,
    regionName: share.region_name,
    visits: share.visits,
    conversions: share.conversions,
    convertingVisits: share.converting_visits,
  }));

const reachSchema = z
  .object({
    visits: z.number(),
    continents: z.number(),
    countries: z.number(),
    regions: z.number(),
    cities: z.number(),
    top_country: z.object({ value: z.string(), visits: z.number() }).nullable(),
    top_region: z
      .object({ value: z.string(), name: z.string().nullable(), visits: z.number() })
      .nullable(),
  })
  .transform((reach) => ({
    visits: reach.visits,
    continents: reach.continents,
    countries: reach.countries,
    regions: reach.regions,
    cities: reach.cities,
    topCountry: reach.top_country,
    topRegion: reach.top_region,
  }));

export const devicesResponseSchema = z
  .object({
    device_types: z.array(valueShareSchema),
    browsers: z.array(valueShareSchema),
    operating_systems: z.array(valueShareSchema),
    countries: z.array(valueShareSchema),
    regions: z.array(regionShareSchema),
    cities: z.array(cityShareSchema),
    reach: reachSchema,
  })
  .transform((body) => ({
    deviceTypes: body.device_types,
    browsers: body.browsers,
    operatingSystems: body.operating_systems,
    countries: body.countries,
    regions: body.regions,
    cities: body.cities,
    reach: body.reach,
  }));

export type DevicesReport = z.output<typeof devicesResponseSchema>;
export type DevicesWire = z.input<typeof devicesResponseSchema>;
