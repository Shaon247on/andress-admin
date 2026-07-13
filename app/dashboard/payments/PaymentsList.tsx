"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  Eye,
  XCircle,
} from "lucide-react";
import type { PaymentResult, PaymentStats } from "@/types/Payment.type";

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-500">
        <Clock className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  }
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-500">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
      <XCircle className="w-3.5 h-3.5" />
      Rejected
    </span>
  );
};

const StatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Rejected", value: "rejected" },
];

interface PaymentsListProps {
  payments: PaymentResult[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null;
  stats: PaymentStats | null;
  errorMessage?: string;
  statsError?: string;
}

export default function PaymentsList({
  payments = [],
  pagination = null,
  stats = null,
  errorMessage,
  statsError,
}: PaymentsListProps) {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Primary green card */}
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-[#00c853] text-white justify-center relative overflow-hidden">
          <div className="absolute top-6 right-6">
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <DollarSign className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">
            ${stats ? parseFloat(stats.total_revenue).toLocaleString() : "0"}
          </p>
          <p className="text-sm font-medium opacity-90">Total Revenue</p>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border border-border shadow-sm rounded-2xl bg-surface justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">
              $
              {stats
                ? parseFloat(stats.platform_commission).toLocaleString()
                : "0"}
            </p>
            <p className="text-xs font-medium text-text-muted mt-1">
              Platform Commission (15%)
            </p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border border-border shadow-sm rounded-2xl bg-surface justify-center">
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">
              $
              {stats
                ? parseFloat(stats.pending_payments).toLocaleString()
                : "0"}
            </p>
            <p className="text-xs font-medium text-text-muted mt-1">
              Pending Payments
            </p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border border-border shadow-sm rounded-2xl bg-surface justify-center">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">
              {stats ? stats.completed_transactions : 0}
            </p>
            <p className="text-xs font-medium text-text-muted mt-1">
              Completed Transactions
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchInput
            name="search"
            placeholder="Search by court manager or ID..."
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SelectFilter
            name="status"
            placeholder="All Status"
            options={StatusOptions}
          />
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Table */}
      <Card className="border border-border shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#fafafa] text-text font-semibold border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Court Manager
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Courts
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Period
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Request Date
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-surface hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-[#00c853] font-medium text-xs whitespace-nowrap">
                      {payment.code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">
                        {payment.court_manager.name}
                      </div>
                      <div className="text-text-muted mt-0.5 text-xs">
                        {payment.court_manager.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text font-medium text-sm whitespace-nowrap">
                      {payment.courts || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap text-sm">
                      {payment.period}
                    </td>
                    <td className="px-6 py-4 text-text font-bold whitespace-nowrap">
                      ${parseFloat(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap text-sm">
                      {new Date(payment.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/dashboard/payments/${payment.code}`}>
                        <Button
                          size="sm"
                          className="h-8 bg-[#00c853] hover:bg-[#00e676] text-white text-xs border-none shadow-sm rounded-full px-4"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {pagination && pagination.total_pages > 1 && (
        <Pagination total={pagination.count} pageSize={pagination.page_size} />
      )}
    </>
  );
}
