"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import AdminActionDialog from "./AdminActionDialog";
import { Card } from "@/components/ui/card";
import { Mail, Clock, Shield, ShieldCheck, Plus } from "lucide-react";
import type { AdminUserResult } from "@/types/AdminUser.type";

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "active" || status === "Active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

export default function AdminUserList({
  users = [],
  total = 0,
  errorMessage,
}: {
  users: AdminUserResult[];
  total?: number;
  errorMessage?: string;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserResult | null>(null);

  const openAdd = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (u: AdminUserResult) => {
    setEditing(u);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput name="search" placeholder="Search admin users..." />
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 h-10 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Admin User
        </button>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Table */}
      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-text font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Admin Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                    No admin users found.
                  </td>
                </tr>
              ) : (
                users.map((admin) => (
                  <tr key={admin.id} className="bg-surface hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#e2f5ec] flex items-center justify-center text-primary font-bold">
                          {admin.full_name?.charAt(0) || admin.email?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-text">{admin.full_name || admin.email}</div>
                          <div className="text-text-muted flex items-center gap-1 mt-1 text-xs">
                            <Mail className="h-3 w-3" />
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-text">
                        {admin.role === "super_admin" ? (
                          <ShieldCheck className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Shield className="h-4 w-4 text-slate-500" />
                        )}
                        <span className="font-medium">{admin.role_display || admin.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={admin.status || "unknown"} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {admin.last_login
                          ? new Date(admin.last_login).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => openEdit(admin)}
                        className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination total={total} pageSize={10} />

      <AdminActionDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editing={editing}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}