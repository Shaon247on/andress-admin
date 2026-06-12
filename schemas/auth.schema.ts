import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  session_token: z.string().min(1).optional(),
  otp: z.string().min(6).max(6),
});

export const resetPasswordSchema = z
  .object({
    reset_token: z.string().min(1),
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
