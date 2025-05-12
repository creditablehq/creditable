import { z } from 'zod';

export const PlanSchema = z.object({
  premium: z.number(),
  durationDays: z.number(),
  carrier: z.string().optional(),
});

export type PlanInput = z.infer<typeof PlanSchema>;
