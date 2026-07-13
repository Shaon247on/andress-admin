"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/elements/logo';
import { Card, CardContent } from '@/components/elements/card';
import { Input } from '@/components/elements/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/schemas/auth.schema';
import { forgotPasswordAction } from '@/actions/auth.action';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(undefined);
    setIsLoading(true);

    const result = await forgotPasswordAction(values);
    setIsLoading(false);

    if (result.success) {
      router.push('/otp');
      return;
    }

    setError(result.message || 'Unable to send reset instructions.');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mx-auto mb-6 h-12" />
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Forgot Password?</h2>
          <p className="mt-1 text-sm text-text-muted">No worries! Enter your email and we&apos;ll send you reset instructions.</p>
        </div>

        <Card className="p-2 sm:p-4">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@athlonego.com"
                    required
                    className="h-11 pl-10"
                    {...register('email')}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <Mail className="h-5 w-5" />
                  </div>
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <div className="space-y-4">
                <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold">
                  {isLoading ? 'Sending…' : 'Send Reset Instructions'}
                </Button>

                <Link href="/login" className="block w-full">
                  <Button type="button" variant="outline" className="w-full h-11 text-base font-semibold bg-surface/50 border-none shadow-none text-text-muted hover:bg-surface hover:text-text">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-text-muted">© 2026 AthlonGo. All rights reserved.</p>
      </div>
    </div>
  );
}
