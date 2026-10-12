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

export const devicesResponseSchema = z
  .object({
    device_types: z.array(valueShareSchema),
    browsers: z.array(valueShareSchema),
    operating_systems: z.array(valueShareSchema),
    countries: z.array(valueShareSchema),
    regions: z.array(regionShareSchema),
  })
  .transform((body) => ({
    deviceTypes: body.device_types,
    browsers: body.browsers,
    operatingSystems: body.operating_systems,
    countries: body.countries,
    regions: body.regions,
  }));

export type DevicesReport = z.output<typeof devicesResponseSchema>;
export type DevicesWire = z.input<typeof devicesResponseSchema>;
