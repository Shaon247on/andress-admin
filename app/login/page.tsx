"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/elements/logo';
import { Card, CardContent } from '@/components/elements/card';
import { Input } from '@/components/elements/input';
import { Button } from '@/components/elements/button';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/schemas/auth.schema';
import { loginAction } from '@/actions/auth.action';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(undefined);

    const result = await loginAction(values);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard');
      return;
    }

    setError(result.message || 'Unable to sign in.');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center w-full border-2">
          <Logo className="mx-auto mb-6 h-12" />
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Admin Dashboard</h2>
          <p className="mt-1 text-sm text-text-muted">Sign in to access your dashboard</p>
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
                    className="h-11"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="h-11 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/90">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold">
                {isLoading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-text-muted">© 2026 AthlonGo. All rights reserved.</p>
      </div>
    </div>
  );
}
