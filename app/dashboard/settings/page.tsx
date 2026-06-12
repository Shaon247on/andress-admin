import React from 'react';
import Link from 'next/link';
import { User, Lock, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/elements/card';
import { Input } from '@/components/elements/input';
import { Button } from '@/components/elements/button';

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
        <p className="text-text-muted">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <User className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                AU
              </div>
              <div>
                <Button variant="outline" className="mb-2">Change Photo</Button>
                <p className="text-xs text-text-muted">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Full Name</label>
                <Input defaultValue="Admin User" className="w-full" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input defaultValue="admin@athlongo.com" className="pl-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input defaultValue="+1 (555) 123-4567" className="pl-10 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Lock className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-xl">Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <h3 className="font-medium text-text">Password</h3>
                <p className="text-sm text-text-muted mt-1">Last changed 30 days ago</p>
              </div>
              <Link href="/dashboard/settings/change-password">
                <Button variant="outline">Change Password</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 h-auto flex items-center gap-2">
            <span className="w-4 h-4 inline-block border-2 border-current border-r-transparent rounded-full opacity-0"></span>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
