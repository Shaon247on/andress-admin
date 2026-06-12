"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { createAdminUserAction, editAdminUserAction } from "@/actions/admin-user.action";
import type { AdminUserResult, AdminUserRole, Permissions } from "@/types/AdminUser.type";

const ROLES: { value: AdminUserRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "support", label: "Support" },
];

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

type PermissionKey = keyof Permissions;

const PERMISSION_FIELDS: { key: PermissionKey; label: string }[] = [
  { key: "can_users", label: "Users" },
  { key: "can_courts", label: "Courts" },
  { key: "can_bookings", label: "Bookings" },
  { key: "can_payments", label: "Payments" },
  { key: "can_settings", label: "Settings" },
  { key: "can_support", label: "Support" },
  { key: "can_reports", label: "Reports" },
];

const DEFAULT_PERMISSIONS: Permissions = {
  can_users: false,
  can_courts: false,
  can_bookings: false,
  can_payments: false,
  can_settings: false,
  can_support: false,
  can_reports: false,
};

interface AdminActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: AdminUserResult | null;
  onSuccess?: () => void;
}

export default function AdminActionDialog({
  open,
  onOpenChange,
  editing = null,
  onSuccess,
}: AdminActionDialogProps) {
  const isEdit = !!editing;
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminUserRole>("moderator");
  const [permissions, setPermissions] = useState<Permissions>(DEFAULT_PERMISSIONS);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setFullName(editing.full_name ?? "");
      setEmail(editing.email ?? "");
      setRole((editing.role as AdminUserRole) ?? "moderator");
      setPermissions(editing.permissions ?? DEFAULT_PERMISSIONS);
    } else {
      setFullName("");
      setEmail("");
      setRole("moderator");
      setPermissions(DEFAULT_PERMISSIONS);
    }
    setError(null);
    setSuccessMsg(null);
  }, [editing, open]);

  const togglePermission = (key: PermissionKey) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    startTransition(async () => {
      if (isEdit && editing?.id) {
        const res = await editAdminUserAction(editing.id, { full_name: fullName, role, permissions });
        if (!res.success) { setError(res.message); return; }
        setSuccessMsg(res.message);
      } else {
        const res = await createAdminUserAction({ full_name: fullName, email, role, permissions });
        if (!res.success) { setError(res.message); return; }
        setSuccessMsg(res.message);
      }
      onSuccess?.();
      setTimeout(() => onOpenChange(false), 1200);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl bg-white gap-0 [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {isEdit ? "Edit Admin User" : "Add New Admin"}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                {successMsg}
              </div>
            )}

            {/* Full Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  disabled={isPending}
                  required
                  className="h-10 rounded-xl border-border bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@athlon.com"
                  disabled={isEdit || isPending}
                  required={!isEdit}
                  className="h-10 rounded-xl border-border bg-background disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Role + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-sm font-medium text-foreground">
                  Role
                </Label>
                <div className="relative">
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminUserRole)}
                    disabled={isPending}
                    className="w-full h-10 appearance-none rounded-xl border border-border bg-background px-3 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer disabled:opacity-60"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-sm font-medium text-foreground">
                  Status
                </Label>
                <div className="relative">
                  <select
                    id="status"
                    value={editing?.status ?? "active"}
                    disabled
                    className="w-full h-10 appearance-none rounded-xl border border-border bg-background px-3 pr-9 text-sm text-foreground outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Permissions Setup</Label>
              <div className="rounded-xl border border-border p-4">
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                  {PERMISSION_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={`perm-${key}`}
                        checked={permissions[key]}
                        onCheckedChange={() => togglePermission(key)}
                        disabled={isPending}
                        className="rounded"
                      />
                      <label
                        htmlFor={`perm-${key}`}
                        className="text-sm text-muted-foreground cursor-pointer select-none"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4 bg-background">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-10 rounded-xl border border-border bg-white px-5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Admin"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}