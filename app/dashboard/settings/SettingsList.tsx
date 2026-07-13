// app/dashboard/settings/SettingsList.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Mail, Phone, Camera, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/elements/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { updateProfileAction } from "@/actions/settings.action";
import { profileUpdateSchema } from "@/schemas/Settings.schema";
import type { Profile } from "@/types/Settings.type";
import { toast } from "sonner";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

interface SettingsListProps {
  profile: Profile | null;
  errorMessage?: string;
}

type ProfileFormValues = {
  full_name?: string;
  email?: string;
  phone_number?: string;
};

export default function SettingsList({
  profile,
  errorMessage,
}: SettingsListProps) {
  const router = useRouter();
  const { refreshUser, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.avatar_url || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: profile?.email || "",
      phone_number: profile?.phone_number || "",
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
      });
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Image must be JPG, PNG, or GIF format");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);

    const formData = new FormData();
    if (data.full_name) formData.append("full_name", data.full_name);
    if (data.email) formData.append("email", data.email);
    if (data.phone_number) formData.append("phone_number", data.phone_number);
    if (selectedFile) formData.append("avatar", selectedFile);

    const res = await updateProfileAction(formData);

    if (res.success) {
      toast.success(res.data.message);

      // Update the user context with the new profile data
      await refreshUser();

      // Refresh the page to update the profile data
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const fullName = watch("full_name");
  const email = watch("email");

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "AU";
  };

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {errorMessage}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <User className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden">
                  {avatarPreview ? (
                    <Image
                      width={64}
                      height={64}
                      src={avatarPreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-background border border-border rounded-full hover:bg-background/80 transition-colors"
                >
                  <Camera className="h-4 w-4 text-text-muted" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="mb-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </Button>
                <p className="text-xs text-text-muted">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                <Input
                  id="full-name"
                  placeholder="Enter your full name"
                  {...register("full_name")}
                  data-invalid={!!errors.full_name}
                  aria-invalid={!!errors.full_name}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.full_name.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    disabled
                    id="email"
                    placeholder="Enter your email address"
                    className="pl-10"
                    {...register("email")}
                    data-invalid={!!errors.email}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    {...register("phone_number")}
                    data-invalid={!!errors.phone_number}
                    aria-invalid={!!errors.phone_number}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone_number.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
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
              </div>
              <Link href="/dashboard/settings/change-password">
                <Button variant="outline" type="button">
                  Change Password
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Field orientation="horizontal">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 h-auto flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Field>
      </div>
    </form>
  );
}
