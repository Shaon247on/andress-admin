// schemas/AdminSupport.schema.ts

import { z } from 'zod';

export const adminSupportQuerySchema = z.object({
  audience: z.enum(['users', 'managers']),
  search: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'resolved']).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const adminReplySchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

export const adminStatusUpdateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved']),
});

export const adminEscalateSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  category: z.string().default('other'),
});