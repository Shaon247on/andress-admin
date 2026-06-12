"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '@/schemas/auth.schema';
import { resetPasswordAction } from '@/actions/auth.action';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setError(undefined);
    setIsLoading(true);

    const result = await resetPasswordAction(values);
    setIsLoading(false);

    if (result.success) {
      router.push('/login');
      return;
    }

    setError(result.message || 'Unable to reset password.');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-text">Reset Password</h2>
          <p className="text-sm text-text-muted">Choose a new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-surface p-6 rounded-3xl shadow-sm border border-border">
          <div>
            <label className="block text-sm font-medium text-text-muted">New Password</label>
            <input
              type="password"
              {...register('new_password')}
              className="w-full h-11 rounded-xl bg-background border-border mt-2 px-3"
            />
            {errors.new_password && <p className="mt-2 text-sm text-red-600">{errors.new_password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted">Confirm Password</label>
            <input
              type="password"
              {...register('confirm_password')}
              className="w-full h-11 rounded-xl bg-background border-border mt-2 px-3"
            />
            {errors.confirm_password && <p className="mt-2 text-sm text-red-600">{errors.confirm_password.message}</p>}
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-primary text-white px-4 py-2 rounded-xl">
              {isLoading ? 'Resetting…' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
