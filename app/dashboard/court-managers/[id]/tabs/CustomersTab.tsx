"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/elements/card";
import Pagination from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";
import { getCustomersTabAction } from "@/actions/court-manager.action";
import type { CustomerItem, PaginationInfo } from "@/types/CourtManager.type";
import { toast } from "sonner";

interface CustomersTabProps {
  managerId: string;
}

export default function CustomersTab({ managerId }: CustomersTabProps) {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
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
      const res = await getCustomersTabAction(managerId, currentPage);
      if (res.success) {
        setCustomers(res.data.customers);
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
    <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
      <div className="p-6 pb-2 border-b border-border text-base font-semibold text-text">
        Customers List
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Country</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Total Games</th>
              <th className="px-6 py-4 font-medium">Benefits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-background/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-text">{customer.full_name}</p>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{customer.country}</td>
                  <td className="px-6 py-4 text-text-muted">{customer.phone}</td>
                  <td className="px-6 py-4 text-text-muted">{customer.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">
                      {customer.total_games} games
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {customer.benefits === 0 ? (
                      <span className="text-text-muted text-sm">None</span>
                    ) : (
                      <span className="inline-flex px-2 py-1 rounded bg-green-50 text-green-600 text-[10px] font-bold border border-green-200">
                        {customer.benefits} active
                      </span>
                    )}
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
  );
}