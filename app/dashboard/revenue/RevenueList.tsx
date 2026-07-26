"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Wallet,
  ArrowUpRight,
  History,
  AlertCircle,
  Euro,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Types ──
interface Withdrawal {
  id: string;
  user: string;
  userEmail: string;
  amount: number;
  date: Date;
  remainingBalance: number; 
}

interface RevenueStats {
  totalRevenue: number;
  platformCommission: number;
  userCommission: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  availableBalance: number;
}

// ── Main Component ──
export default function RevenuePage() {
  // ── State ──
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Static Data (would come from API) ──
  const stats: RevenueStats = {
    totalRevenue: 28450.75,
    platformCommission: 4267.61,
    userCommission: 3560.50,
    pendingWithdrawals: 1250.00,
    completedWithdrawals: 18950.00,
    availableBalance: 1000.00,
  };

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    {
      id: "1",
      user: "John Doe",
      userEmail: "john.doe@courts.com",
      amount: 500.00,
      date: new Date("2026-07-20T10:30:00"),
      remainingBalance: 8500.00,
    },
    {
      id: "2",
      user: "Sarah Johnson",
      userEmail: "sarah.j@courts.com",
      amount: 750.00,
      date: new Date("2026-07-18T14:15:00"),
      remainingBalance: 9000.00,
    },
    {
      id: "3",
      user: "Michael Chen",
      userEmail: "michael.c@courts.com",
      amount: 300.00,
      date: new Date("2026-07-15T09:45:00"),
      remainingBalance: 9750.00,
    },
    {
      id: "4",
      user: "Emma Williams",
      userEmail: "emma.w@courts.com",
      amount: 1000.00,
      date: new Date("2026-07-12T16:20:00"),
      remainingBalance: 10500.00,
    },
    {
      id: "5",
      user: "James Rodriguez",
      userEmail: "james.r@courts.com",
      amount: 250.00,
      date: new Date("2026-07-10T11:00:00"),
      remainingBalance: 11500.00,
    },
  ]);

  // ── Handlers ──
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > stats.availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const newWithdrawal: Withdrawal = {
        id: `w-${Date.now()}`,
        user: "Current User",
        userEmail: "user@example.com",
        amount: amount,
        date: new Date(),
        remainingBalance: stats.availableBalance - amount,
      };

      setWithdrawals([newWithdrawal, ...withdrawals]);
      setWithdrawAmount("");
      setIsWithdrawDialogOpen(false);
      setIsProcessing(false);
      toast.success(`€${amount.toFixed(2)} withdrawal request submitted`);
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Summary Cards ──
  const summaryCards = [
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      icon: Euro,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      textColor: "text-white",
    },
    {
      title: "Platform Commission",
      value: stats.platformCommission,
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      gradient: "bg-white",
      textColor: "text-text",
    },
    {
      title: "User Commission",
      value: stats.userCommission,
      icon: Wallet,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      gradient: "bg-white",
      textColor: "text-text",
    },
    {
      title: "Completed Withdrawals",
      value: stats.completedWithdrawals,
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      gradient: "bg-white",
      textColor: "text-text",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-emerald-600 font-medium">Available Balance</p>
            <p className="text-xl font-bold text-emerald-700">
              €{stats.availableBalance.toLocaleString()}
            </p>
          </div>
          <Button
            className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm"
            onClick={() => setIsWithdrawDialogOpen(true)}
            disabled={stats.availableBalance <= 0}
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
            {withdrawals.length} withdrawals
          </span>
        </div>

        <div className="overflow-x-auto p-6 pt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
                <TableHead className="font-semibold text-text">User</TableHead>
                <TableHead className="font-semibold text-text">Amount</TableHead>
                <TableHead className="font-semibold text-text">Date</TableHead>
                <TableHead className="font-semibold text-text">Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-text-muted py-8"
                  >
                    No withdrawals found
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id} className="hover:bg-background/50">
                    <TableCell>
                      <div className="font-medium text-text">
                        {withdrawal.user}
                      </div>
                      <div className="text-text-muted text-xs">
                        {withdrawal.userEmail}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600">
                      €{withdrawal.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-text-muted text-sm">
                      {formatDate(withdrawal.date)}
                    </TableCell>
                    <TableCell className="font-medium text-text">
                      €{withdrawal.remainingBalance.toLocaleString(undefined, {
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
                €{stats.availableBalance.toLocaleString(undefined, {
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
                  max={stats.availableBalance}
                  step={0.01}
                />
              </div>
              {withdrawAmount && parseFloat(withdrawAmount) > stats.availableBalance && (
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
                parseFloat(withdrawAmount) > stats.availableBalance
              }
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
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