import { z } from 'zod';

export const bookingsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['confirmed', 'cancelled', 'completed', 'pending']).optional(),
  page: z.coerce.number().min(1).optional(),
});