"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtpSchema, VerifyOtpFormValues } from '@/schemas/auth.schema';
import { verifyOtpAction } from '@/actions/auth.action';

export default function OtpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const onSubmit = async (values: VerifyOtpFormValues) => {
    setError(undefined);
    setIsLoading(true);

    const result = await verifyOtpAction(values);
    setIsLoading(false);

    if (result.success) {
      router.push('/reset-password');
      return;
    }

    setError(result.message || 'OTP verification failed.');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-text">Verify OTP</h2>
          <p className="text-sm text-text-muted">Enter the 6-digit code sent to your email.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-surface p-6 rounded-3xl shadow-sm border border-border">
          <div>
            <label className="block text-sm font-medium text-text-muted">OTP Code</label>
            <input
              maxLength={6}
              {...register('otp')}
              className="w-full h-11 rounded-xl bg-background border-border mt-2 px-3"
            />
            {errors.otp && <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>}
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-primary text-white px-4 py-2 rounded-xl">
              {isLoading ? 'Verifying…' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
