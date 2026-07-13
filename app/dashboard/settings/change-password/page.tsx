// app/dashboard/settings/change-password/page.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/elements/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field';
import { changePasswordAction } from '@/actions/settings.action';
import { changePasswordSchema } from '@/schemas/Settings.schema';
import { toast } from 'sonner';

type ChangePasswordFormValues = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

const PasswordRequirement = ({ met, text }: { met: boolean | string; text: string }) => (
  <li className="flex items-center gap-2 text-sm">
    <div className={`w-2 h-2 rounded-full ${met ? 'bg-green-500' : 'bg-border'}`}></div>
    <span className={met ? 'text-text' : 'text-text-muted'}>{text}</span>
  </li>
);

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = watch('new_password');
  const confirmPassword = watch('confirm_password');

  const passwordMet = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    match: newPassword && confirmPassword && newPassword === confirmPassword,
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setLoading(true);
    const res = await changePasswordAction(data);

    if (res.success) {
      toast.success(res.data.message);
      setTimeout(() => {
        router.push('/dashboard/settings');
      }, 1500);
    } else {
      toast.error(res.message);
      if (res.message.toLowerCase().includes('current password')) {
        setError('current_password', { message: res.message });
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/settings" className="p-2 bg-surface hover:bg-background rounded-full border border-border transition-colors">
          <ArrowLeft className="h-5 w-5 text-text" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text mb-1">Change Password</h1>
          <p className="text-text-muted">Update your password to keep your account secure</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Password Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrent ? "text" : "password"}
                        placeholder="Enter your current password"
                        className="w-full pr-10"
                        {...register('current_password')}
                        data-invalid={!!errors.current_password}
                        aria-invalid={!!errors.current_password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.current_password && (
                      <p className="text-sm text-red-500 mt-1">{errors.current_password.message}</p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNew ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="w-full pr-10"
                        {...register('new_password')}
                        data-invalid={!!errors.new_password}
                        aria-invalid={!!errors.new_password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.new_password && (
                      <p className="text-sm text-red-500 mt-1">{errors.new_password.message}</p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm New Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm your new password"
                        className="w-full pr-10"
                        {...register('confirm_password')}
                        data-invalid={!!errors.confirm_password}
                        aria-invalid={!!errors.confirm_password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-red-500 mt-1">{errors.confirm_password.message}</p>
                    )}
                  </Field>
                </FieldGroup>

                <div className="p-5 bg-background rounded-xl border border-border mt-6">
                  <h4 className="text-sm font-medium text-text mb-3">Password must contain:</h4>
                  <ul className="space-y-2">
                    <PasswordRequirement met={passwordMet.length} text="At least 8 characters" />
                    <PasswordRequirement met={passwordMet.uppercase} text="One uppercase letter" />
                    <PasswordRequirement met={passwordMet.lowercase} text="One lowercase letter" />
                    <PasswordRequirement met={passwordMet.number} text="One number" />
                    <PasswordRequirement met={passwordMet.match} text="Passwords match" />
                  </ul>
                </div>

                <Field orientation="horizontal" className="pt-6">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                  <Link href="/dashboard/settings">
                    <Button variant="outline" type="button">Cancel</Button>
                  </Link>
                </Field>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-80">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm text-text-muted list-disc pl-4">
                <li>Use a unique password that you don&apos;t use for other websites</li>
                <li>Avoid using personal information in your password</li>
                <li>Consider using a password manager to generate and store strong passwords</li>
                <li>Change your password regularly, especially if you suspect unauthorized access</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}