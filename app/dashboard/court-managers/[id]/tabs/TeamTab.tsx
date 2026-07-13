"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/elements/card";
import Pagination from "@/components/common/Pagination";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { getTeamTabAction } from "@/actions/court-manager.action";
import type { StaffItem, PaginationInfo } from "@/types/CourtManager.type";
import { toast } from "sonner";

interface TeamTabProps {
  managerId: string;
}

export default function TeamTab({ managerId }: TeamTabProps) {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [cards, setCards] = useState({ total: 0, active: 0 });
  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await getTeamTabAction(managerId, currentPage);
      if (res.success) {
        setStaff(res.data.staff);
        setCards(res.data.cards);
        setPagination(res.data.pagination);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    };

    loadData();
  }, [managerId, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
          <p className="text-sm text-text-muted font-medium">Total Staff</p>
          <p className="text-3xl font-bold text-text mt-2">{cards.total}</p>
        </Card>
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
          <p className="text-sm text-text-muted font-medium">Active Staff</p>
          <p className="text-3xl font-bold text-[#10b981] mt-2">{cards.active}</p>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="p-6 pb-2 border-b border-border text-base font-semibold text-text">
          Manager Staffs
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                    No staff members found.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-text">{member.name}</td>
                    <td className="px-6 py-4 text-text-muted">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {member.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{member.phone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded bg-purple-50 text-purple-600 text-[10px] font-bold">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold border ${
                          member.is_active
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-border">
            <Pagination total={pagination.count} pageSize={pagination.page_size} />
          </div>
        )}
      </Card>
    </div>
  );
}