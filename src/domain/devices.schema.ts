import { z } from 'zod';

const valueShareSchema = z.object({
  value: z.string(),
  visits: z.number(),
  conversions: z.number().nullable(),
});

export const devicesResponseSchema = z
  .object({
    device_types: z.array(valueShareSchema),
    browsers: z.array(valueShareSchema),
    operating_systems: z.array(valueShareSchema),
    countries: z.array(valueShareSchema),
  })
  .transform((body) => ({
    deviceTypes: body.device_types,
    browsers: body.browsers,
    operatingSystems: body.operating_systems,
    countries: body.countries,
  }));

export type DevicesReport = z.output<typeof devicesResponseSchema>;
export type DevicesWire = z.input<typeof devicesResponseSchema>;
