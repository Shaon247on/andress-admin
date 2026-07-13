import { z } from 'zod';

export const courtsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'under_maintenance', 'closed']).optional(),
  court_type: z.enum(['indoor', 'outdoor', 'both']).optional(),
  page: z.coerce.number().min(1).optional(),
});