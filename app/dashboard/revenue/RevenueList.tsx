"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Wallet,
  ArrowUpRight,
  History,
  AlertCircle,
  Euro,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getRevenueStatsAction, getRevenueHistoryAction, withdrawAction } from "@/actions/revenue.action";
import type { RevenueStats, RevenueHistoryItem } from "@/types/Revenue.type";

interface RevenuePageProps {
  initialStats?: RevenueStats | null;
  initialHistory?: RevenueHistoryItem[];
  initialPagination?: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null;
  statsError?: string;
  historyError?: string;
}

// ── Main Component ──
export default function RevenuePage({
  initialStats = null,
  initialHistory = [],
  initialPagination = null,
  statsError,
  historyError,
}: RevenuePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ── State ──
  const [stats, setStats] = useState<RevenueStats | null>(initialStats);
  const [history, setHistory] = useState<RevenueHistoryItem[]>(initialHistory);
  const [pagination, setPagination] = useState(initialPagination);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch data ──
  const fetchStats = async () => {
    const res = await getRevenueStatsAction();
    if (res.success) {
      setStats(res.data);
    } else {
      setError(res.message);
    }
  };

  const fetchHistory = async (page?: number, search?: string) => {
    setIsLoading(true);
    const params: any = {};
    if (page) params.page = page;
    if (search) params.search = search;
    
    const res = await getRevenueHistoryAction(params);
    if (res.success) {
      setHistory(res.data.results);
      setPagination(res.data.pagination);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!initialStats) {
      fetchStats();
    }
  }, []);

  // ── Handlers ──
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const availableBalance = stats ? parseFloat(stats.available_balance) : 0;
    if (amount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsProcessing(true);
    const res = await withdrawAction({ amount: withdrawAmount });
    
    if (res.success) {
      toast.success(res.data.message);
      setWithdrawAmount("");
      setIsWithdrawDialogOpen(false);
      // Refresh stats and history
      await fetchStats();
      await fetchHistory(1);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsProcessing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // ── Summary Cards ──
  const summaryCards = [
    {
      title: "Total Revenue",
      value: stats ? parseFloat(stats.total_revenue) : 0,
      icon: Euro,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      textColor: "text-white",
    },
    {
      title: "Platform Commission",
      value: stats ? parseFloat(stats.platform_commission) : 0,
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      gradient: "bg-white",
      textColor: "text-text",
    },
    {
      title: "User Commission",
      value: stats ? parseFloat(stats.user_commission) : 0,
      icon: Wallet,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      gradient: "bg-white",
      textColor: "text-text",
    },
    {
      title: "Completed Withdrawals",
      value: stats ? parseFloat(stats.completed_withdrawals) : 0,
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      gradient: "bg-white",
      textColor: "text-text",
    },
  ];

  const availableBalance = stats ? parseFloat(stats.available_balance) : 0;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-emerald-600 font-medium">Available Balance</p>
            <p className="text-xl font-bold text-emerald-700">
              €{availableBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <Button
            className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm"
            onClick={() => setIsWithdrawDialogOpen(true)}
            disabled={availableBalance <= 0}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isTotalRevenue = card.title === "Total Revenue";

          return (
            <Card
              key={card.title}
              className={cn(
                "flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl justify-center relative overflow-hidden",
                card.gradient,
                isTotalRevenue ? "text-white" : "bg-surface"
              )}
            >
              {isTotalRevenue && (
                <div className="absolute top-6 right-6 opacity-20">
                  <TrendingUp className="w-6 h-6" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isTotalRevenue ? "bg-white/20" : card.iconBg
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isTotalRevenue ? "text-white" : card.iconColor
                    )}
                  />
                </div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isTotalRevenue ? "text-white/90" : "text-text-muted"
                  )}
                >
                  {card.title}
                </p>
              </div>
              <p
                className={cn(
                  "text-2xl font-bold",
                  isTotalRevenue ? "text-white" : card.textColor
                )}
              >
                €{card.value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex max-w-xl flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchInput
            name="search"
            placeholder="Search by user or code..."
          />
        </div>
      </div>

      {/* Withdrawal History Table */}
      <Card className="border border-border shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-text-muted" />
            <h3 className="text-base font-semibold text-text">
              Withdrawal History
            </h3>
          </div>
          <span className="text-xs text-text-muted">
            {history.length} withdrawals
          </span>
        </div>

        <div className="overflow-x-auto p-6 pt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
                <TableHead className="font-semibold text-text">Code</TableHead>
                <TableHead className="font-semibold text-text">User</TableHead>
                <TableHead className="font-semibold text-text">Amount</TableHead>
                <TableHead className="font-semibold text-text">Date</TableHead>
                <TableHead className="font-semibold text-text">Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-text-muted py-8"
                  >
                    No withdrawals found
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow key={item.id} className="hover:bg-background/50">
                    <TableCell className="font-medium text-text">
                      {item.code}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-text">
                        {item.user.name}
                      </div>
                      <div className="text-text-muted text-xs">
                        {item.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600">
                      €{parseFloat(item.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-text-muted text-sm">
                      {formatDate(item.date)}
                    </TableCell>
                    <TableCell className="font-medium text-text">
                      €{parseFloat(item.remaining_balance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {pagination && pagination.total_pages > 1 && (
        <Pagination total={pagination.count} pageSize={pagination.page_size} />
      )}

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              Withdraw Funds
            </DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw from your available balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-700 font-medium">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                €{availableBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">
                Amount to Withdraw
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
                  €
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pl-8 h-12 text-lg font-medium"
                  min={0}
                  max={availableBalance}
                  step={0.01}
                />
              </div>
              {withdrawAmount && parseFloat(withdrawAmount) > availableBalance && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Amount exceeds available balance
                </p>
              )}
              {withdrawAmount && parseFloat(withdrawAmount) <= 0 && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Amount must be greater than 0
                </p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-xs text-yellow-700 flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Withdrawals are typically processed within 1-3 business days.
                  You&apos;ll receive a confirmation email once completed.
                </span>
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsWithdrawDialogOpen(false);
                setWithdrawAmount("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleWithdraw}
              disabled={
                isProcessing ||
                !withdrawAmount ||
                parseFloat(withdrawAmount) <= 0 ||
                parseFloat(withdrawAmount) > availableBalance
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Withdraw
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}