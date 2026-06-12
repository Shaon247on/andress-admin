"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/elements/card';
import { Input } from '@/components/elements/input';
import { Button } from '@/components/elements/button';

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Current Password</label>
                <div className="relative">
                  <Input 
                    type={showCurrent ? "text" : "password"} 
                    placeholder="Enter your current password" 
                    className="w-full pr-10" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">New Password</label>
                <div className="relative">
                  <Input 
                    type={showNew ? "text" : "password"} 
                    placeholder="Enter your new password" 
                    className="w-full pr-10" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Confirm New Password</label>
                <div className="relative">
                  <Input 
                    type={showConfirm ? "text" : "password"} 
                    placeholder="Confirm your new password" 
                    className="w-full pr-10" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="p-5 bg-background rounded-xl border border-border">
                <h4 className="text-sm font-medium text-text mb-3">Password must contain:</h4>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-border"></div>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-border"></div>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-border"></div>
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-border"></div>
                    One number
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-border"></div>
                    Passwords match
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 pt-2">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                  Update Password
                </Button>
                <Link href="/dashboard/settings">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
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
                <li>Use a unique password that you don't use for other websites</li>
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
