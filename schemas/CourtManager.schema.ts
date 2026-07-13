// schemas/CourtManager.schema.ts

import { z } from 'zod';

export const courtManagersQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  ordering: z.enum(['-revenue', '-courts_count', 'first_name', '-date_joined']).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const commissionUpdateSchema = z.object({
  percentage: z.number().min(0).max(100),
});