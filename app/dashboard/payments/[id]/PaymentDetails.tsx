// app/dashboard/payments/[code]/PaymentDetails.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
  Mail,
  Phone,
  Building2,
  CreditCard,
  Calendar,
  History,
  AlertCircle,
  ChevronRight,
  Euro,
  Wallet,
  Banknote,
} from "lucide-react";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/elements/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  approvePaymentAction,
  rejectPaymentAction,
} from "@/actions/payment.action";
import type { PaymentDetail } from "@/types/Payment.type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PaymentDetailsProps {
  payment: PaymentDetail;
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-4 h-4 animate-pulse" />
        Pending
      </span>
    );
  }
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 className="w-4 h-4" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-4 h-4" />
      Rejected
    </span>
  );
};

const InfoCard = ({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
}) => (
  <div className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
    <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm sm:text-base font-semibold text-slate-900 truncate">
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>
      )}
    </div>
  </div>
);

const ActivityTimeline = ({ activities }: { activities: PaymentDetail["activities"] }) => (
  <div className="relative pl-6 space-y-4">
    {activities.map((activity, idx) => (
      <div key={activity.id} className="relative">
        {/* Timeline line */}
        {idx < activities.length - 1 && (
          <div className="absolute left-[-2px] top-5 bottom-0 w-0.5 bg-slate-200" />
        )}
        {/* Dot */}
        <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
        <div className="pl-4">
          <p className="text-sm font-semibold text-slate-900">
            {activity.title}
          </p>
          {activity.note && (
            <p className="text-sm text-slate-600 mt-0.5">{activity.note}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
            <span>
              {new Date(activity.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>By: {activity.by}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function PaymentDetails({ payment }: PaymentDetailsProps) {
  const router = useRouter();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    const res = await approvePaymentAction(payment.code);
    if (res.success) {
      toast.success(res.data.message);
      setApproveDialogOpen(false);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setLoading(true);
    const res = await rejectPaymentAction(payment.code, { reason: rejectReason });
    if (res.success) {
      toast.success(res.data.message);
      setRejectDialogOpen(false);
      setRejectReason("");
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const withdrawalAmount = parseFloat(payment.financial_summary.withdrawal_amount);
  const remainingBalance = parseFloat(payment.financial_summary.remaining_balance);

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/payments">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-slate-200 hover:bg-slate-50"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Payment Request
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                #{payment.code} • {payment.manager_info.name}
              </p>
            </div>
          </div>
          <StatusBadge status={payment.status} />
        </div>

        {/* Amount Card - Hero Section */}
        <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-emerald-100">Requested Amount</p>
              <p className="text-4xl sm:text-5xl font-bold mt-1 tracking-tight">
                €{withdrawalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-emerald-100/80 mt-2">
                {payment.financial_summary.period}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <Wallet className="w-5 h-5 text-emerald-200" />
              <div>
                <p className="text-xs text-emerald-200">Remaining Balance</p>
                <p className="text-lg font-bold">
                  €{remainingBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Court Manager Information */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-emerald-500" />
                Manager Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={User}
                  label="Full Name"
                  value={payment.manager_info.name}
                />
                <InfoCard
                  icon={Building2}
                  label="Courts Name"
                  value={payment.manager_info.courts_name}
                />
                <InfoCard
                  icon={Mail}
                  label="Email Address"
                  value={payment.manager_info.email}
                />
                <InfoCard
                  icon={Phone}
                  label="Phone Number"
                  value={payment.manager_info.phone}
                />
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Payment Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={Mail}
                  label="PayPal Email"
                  value={payment.payment_info.paypal_email}
                />
                <InfoCard
                  icon={Banknote}
                  label="Bank Account"
                  value={payment.payment_info.bank_account}
                />
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Actions */}
            {payment.status === "pending" && (
              <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
                <h2 className="text-sm font-bold text-slate-900 mb-4">Actions</h2>
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 shadow-sm rounded-xl text-white font-semibold"
                    onClick={() => setApproveDialogOpen(true)}
                    disabled={loading}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve Withdrawal
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-semibold"
                    onClick={() => setRejectDialogOpen(true)}
                    disabled={loading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Review the request carefully before approving
                </p>
              </Card>
            )}

            {/* Summary Card */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Request Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Request ID</span>
                  <span className="text-sm font-medium text-slate-900">
                    {payment.code}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Status</span>
                  <StatusBadge status={payment.status} />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Period</span>
                  <span className="text-sm font-medium text-slate-900">
                    {payment.financial_summary.period}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-600">Created</span>
                  <span className="text-sm font-medium text-slate-900">
                    {new Date(payment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Activity History */}
        <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-900">Activity History</h2>
            <span className="ml-auto text-xs text-slate-500">
              {payment.activities.length} events
            </span>
          </div>
          {payment.activities.length > 0 ? (
            <ActivityTimeline activities={payment.activities} />
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">
              No activity recorded yet
            </p>
          )}
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              Approve Withdrawal
            </DialogTitle>
            <DialogDescription>
              You are about to approve a withdrawal request of
              <span className="font-bold text-slate-900 block mt-1 text-lg">
                €{withdrawalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              for <strong>{payment.manager_info.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              This action will transfer the funds to the manager's account. This cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              disabled={loading}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              className="sm:flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleApprove}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                "Yes, Approve"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Reject Withdrawal
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              className="min-h-[120px] bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-2">
              This reason will be shared with the manager.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}
              disabled={loading}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              className="sm:flex-1 bg-red-500 hover:bg-red-600 text-white"
              onClick={handleReject}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                "Reject Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}