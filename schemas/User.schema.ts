import { z } from 'zod';

export const usersQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'suspended']).optional(),
  page: z.coerce.number().min(1).optional(),
});