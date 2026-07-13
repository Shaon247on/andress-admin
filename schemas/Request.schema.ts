import { z } from 'zod';

export const requestsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const approveRequestSchema = z.object({
  id: z.string().uuid(),
});

export const declineRequestSchema = z.object({
  id: z.string().uuid(),
});