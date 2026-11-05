import { z } from 'zod';

export const telemetrySchema = z.object({
  pond: z.string().min(1, 'Pond ID is required'),
  species: z.string().min(1, 'Target species is required'),
  date: z.string().min(1, 'Log date is required'),
  phase: z.enum(['Seed', 'Grow-out', 'Harvest']),
  temp: z.coerce.number().min(10, '10-40 °C required').max(40, '10-40 °C required'),
  do: z.coerce.number().positive('DO must be > 0'),
  ph: z.coerce.number().min(4.0, 'Range 4.0 - 10.0').max(10.0, 'Range 4.0 - 10.0'),
  salinity: z.coerce.number().min(0, 'Must be positive'),
  clarity: z.coerce.number().min(0, 'Must be positive'),
  ammonia: z.coerce.number().min(0, 'Must be positive'),
  nitrite: z.coerce.number().min(0, 'Must be positive'),
  alkalinity: z.coerce.number().min(0, 'Must be positive'),
  feed: z.coerce.number().min(0, 'Feed required'),
  fcr: z.coerce.number().min(0.5, '0.5 - 3.0 ratio').max(3.0, '0.5 - 3.0 ratio').default(1.28),
  biomass: z.coerce.number().min(100, 'Min 100 kg required'),
  mortality: z.coerce.number().min(0, 'Must be positive'),
  exchange: z.coerce.number().min(0, 'Must be 0-100%').max(100, 'Must be 0-100%'),
  aeratorMode: z.string().min(1, 'Mode required'),
  additives: z.array(z.string()).default([]),
  tests: z.array(z.string()).default([]),
});

export type TelemetrySchemaType = z.infer<typeof telemetrySchema>;
