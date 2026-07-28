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

interface PaymentDetailsProps {
  payment: PaymentDetail;
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500">
        <Clock className="w-4 h-4" />
        Pending
      </span>
    );
  }
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-500">
        <CheckCircle2 className="w-4 h-4" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
      <XCircle className="w-4 h-4" />
      Rejected
    </span>
  );
};

export default function PaymentDetails({ payment }: PaymentDetailsProps) {

  console.log("the payment::",payment)
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
    const res = await rejectPaymentAction(payment.code, { note: rejectReason });
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

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/payments">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-surface border-border"
              >
                <ArrowLeft className="h-4 w-4 text-text" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-text">
                Payment Request #{payment.code}
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Review and process withdrawal request
              </p>
            </div>
          </div>
          <StatusBadge status={payment.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Data) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Court Manager Info */}
            <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
              <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
                <span className="w-1 h-4 bg-gray-800 rounded-full inline-block" />
                Court Manager Information
              </h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-text-muted mb-1 font-medium">
                    Manager Name
                  </p>
                  <p className="text-sm text-text font-medium">
                    {payment.manager_info.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1 font-medium">
                    Courts Name
                  </p>
                  <p className="text-sm text-text font-medium">
                    {payment.manager_info.courts_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1 font-medium">
                    Email
                  </p>
                  <p className="text-sm text-text font-medium">
                    {payment.manager_info.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1 font-medium">
                    Phone
                  </p>
                  <p className="text-sm text-text font-medium">
                    {payment.manager_info.phone}
                  </p>
                </div>
              </div>
            </Card>

            {/* Financial Summary */}
            <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
              <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
                <span className="font-mono font-bold">€</span>
                Financial Summary - {payment.financial_summary.period}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#f9fafb] rounded-xl border border-border/50">
                  <span className="text-sm font-medium text-text-muted">
                    Withdrawal Amount
                  </span>
                  <span className="text-sm font-bold text-text">
                    €
                    {parseFloat(
                      payment.financial_summary.withdrawal_amount,
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-[#f9fafb] rounded-xl border border-border/50">
                  <span className="text-sm font-medium text-text-muted">
                    Platform Fee (
                    {parseFloat(
                      payment.financial_summary.platform_fee_percent,
                    ).toFixed(0)}
                    %)
                  </span>
                  <span className="text-sm font-bold text-red-500">
                    - $
                    {parseFloat(
                      payment.financial_summary.platform_fee_amount,
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <span className="text-sm font-bold text-green-700">
                    Remaining Balance
                  </span>
                  <span className="text-sm font-bold text-green-700">
                    $
                    {parseFloat(
                      payment.financial_summary.remaining_balance,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
              <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
                <span className="w-4 h-3 border-2 border-text rounded-sm relative inline-block">
                  <span className="absolute top-0 right-0 w-1 h-1 bg-text" />
                </span>
                Payment Information
              </h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-2">
                <div>
                  <p className="text-xs text-text-muted mb-1 font-medium">
                    PayPal Email
                  </p>
                  <p className="text-sm text-text font-medium">
                    {payment.payment_info.paypal_email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1 font-medium">
                    Bank Account
                  </p>
                  <p className="text-sm text-text font-medium">
                    {payment.payment_info.bank_account}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (Actions & History) */}
          <div className="space-y-6">
            {payment.status === "pending" && (
              <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
                <h2 className="text-sm font-bold text-text mb-4">Actions</h2>
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-[#00c853] hover:bg-[#00e676] shadow-sm flex items-center justify-center gap-2 rounded-xl text-white"
                    onClick={() => setApproveDialogOpen(true)}
                    disabled={loading}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Request
                  </Button>
                  <Button
                    className="w-full bg-[#ef5350] hover:bg-[#f44336] shadow-sm flex items-center justify-center gap-2 rounded-xl text-white"
                    onClick={() => setRejectDialogOpen(true)}
                    disabled={loading}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Request
                  </Button>
                </div>
              </Card>
            )}

            <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
              <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" />
                Activity History
              </h2>
              <div className="space-y-4 pl-2 border-l-2 border-[#e0e0e0] ml-2 relative">
                {payment.activities.map((activity, idx) => (
                  <div key={activity.id} className="relative pl-4">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-surface" />
                    <p className="text-xs font-semibold text-text">
                      {activity.title}
                    </p>
                    {activity.note && (
                      <p className="text-xs text-text-muted mt-0.5">
                        {activity.note}
                      </p>
                    )}
                    <p className="text-[10px] text-text-muted mt-1 leading-tight">
                      {new Date(activity.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-[10px] text-text-muted leading-tight">
                      By: {activity.by}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Withdrawal Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this withdrawal request of
              <span className="font-bold text-text ml-1">
                $
                {parseFloat(
                  payment.financial_summary.withdrawal_amount,
                ).toLocaleString()}
              </span>
              for {payment.manager_info.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              disabled={loading}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#00c853] hover:bg-[#00e676] text-white"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              className="min-h-[120px] bg-background border-border rounded-xl focus:ring-2 focus:ring-red-500/20"
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}
              disabled={loading}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ef5350] hover:bg-[#f44336] text-white"
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
