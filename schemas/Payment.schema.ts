// schemas/Payment.schema.ts

import { z } from 'zod';

export const paymentsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'paid', 'rejected']).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const rejectPaymentSchema = z.object({
  note: z.string().min(1, 'Rejection reason is required'),
});