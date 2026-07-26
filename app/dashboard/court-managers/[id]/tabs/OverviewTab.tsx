"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Ban,
  Send,
  UserCheck,
  Loader2,
  Percent, 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/elements/dialog";
import { Input } from "@/components/elements/input";
import {
  suspendManagerAction,
  activateManagerAction,
  updateCommissionAction,
  getCommissionAction,
} from "@/actions/court-manager.action";
import type { CourtManagerDetail } from "@/types/CourtManager.type";
import { toast } from "sonner";

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

interface OverviewTabProps {
  manager: CourtManagerDetail;
}

export default function OverviewTab({ manager }: OverviewTabProps) {
  const router = useRouter();
  const [isSuspending, setIsSuspending] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [commissionPercentage, setCommissionPercentage] = useState<number>(
    manager.overview.commission.percentage
  );
  const [updatingCommission, setUpdatingCommission] = useState(false);

  const handleSuspend = async () => {
    setIsSuspending(true);
    const res = await suspendManagerAction(manager.id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsSuspending(false);
  };

  const handleActivate = async () => {
    setIsSuspending(true);
    const res = await activateManagerAction(manager.id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsSuspending(false);
  };

  const handleUpdateCommission = async () => {
    setUpdatingCommission(true);
    const res = await updateCommissionAction(manager.id, {
      percentage: commissionPercentage,
    });
    if (res.success) {
      toast.success(res.data.message);
      setIsCommissionOpen(false);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setUpdatingCommission(false);
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Manager Information */}
          <Card className="border-none shadow-sm rounded-2xl bg-surface p-6 space-y-6">
            <h3 className="text-base font-semibold text-text">Manager Information</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1">Email</p>
                  <p className="text-sm text-text">{manager.overview.manager_info.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1">Location</p>
                  <p className="text-sm text-text">
                    {manager.overview.manager_info.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1">Phone</p>
                  <p className="text-sm text-text">
                    {manager.overview.manager_info.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1">Joined</p>
                  <p className="text-sm text-text">
                    {new Date(
                      manager.overview.manager_info.joined
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Bookings */}
          <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
            <div className="p-6 pb-2 border-b border-border text-base font-semibold text-text">
              Recent Bookings
            </div>
            <div className="divide-y divide-border">
              {manager.overview.recent_bookings.length === 0 ? (
                <div className="p-6 text-center text-text-muted">No recent bookings</div>
              ) : (
                manager.overview.recent_bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 flex items-center justify-between hover:bg-background/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-text leading-none">
                        {booking.players.join(", ")}
                      </p>
                      <p className="text-xs text-text-muted mt-2 leading-none">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        • {booking.start_time.slice(0, 5)} -{" "}
                        {booking.end_time.slice(0, 5)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text leading-none">
                        €{parseFloat(booking.amount).toFixed(2)}
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded bg-green-100 text-green-700 leading-none">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Account Status */}
          <Card className="border-none shadow-sm rounded-2xl bg-surface p-6">
            <h3 className="text-base font-semibold text-text mb-6">Account Status</h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">Status</p>
                <StatusBadge status={manager.status} />
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">Last Active</p>
                <p className="text-sm text-text">
                  {manager.overview.account_status.last_active
                    ? new Date(
                        manager.overview.account_status.last_active
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Never"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">Member Since</p>
                <p className="text-sm text-text">
                  {new Date(
                    manager.overview.account_status.member_since
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {manager.status === "active" ? (
                <Button
                  variant="default"
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white h-11 text-sm font-medium"
                  onClick={handleSuspend}
                  disabled={isSuspending}
                >
                  {isSuspending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Ban className="mr-2 h-4 w-4" />
                  )}
                  Suspend Account
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white h-11 text-sm font-medium"
                  onClick={handleActivate}
                  disabled={isSuspending}
                >
                  {isSuspending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="mr-2 h-4 w-4" />
                  )}
                  Activate Account
                </Button>
              )}
              {/* <Button
                variant="outline"
                className="w-full h-11 text-sm font-medium border-border shadow-none"
              >
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button> */}
              <Button
                variant="outline"
                className="w-full h-11 text-sm font-medium border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10 shadow-none"
                onClick={() => setIsCommissionOpen(true)}
              >
                <Percent className="mr-2 h-4 w-4" /> Commission Setup
              </Button>
            </div>
          </Card>

          {/* Performance */}
          <Card className="border-none shadow-sm rounded-2xl bg-surface p-6">
            <h3 className="text-base font-semibold text-text mb-6">Performance</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted font-medium">Bookings</span>
                  <span className="text-text">{manager.overview.performance.bookings}</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-text rounded-full"
                    style={{
                      width: `${Math.min(
                        (manager.overview.performance.bookings / 200) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted font-medium">Rating</span>
                  <span className="text-text">
                    {manager.overview.performance.rating.average.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-text rounded-full"
                    style={{
                      width: `${
                        (manager.overview.performance.rating.average / 5) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div> */}

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted font-medium">Revenue</span>
                  <span className="text-text">
                    €{manager.overview.performance.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-text rounded-full"
                    style={{
                      width: `${Math.min(
                        (manager.overview.performance.revenue / 20000) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Commission Dialog */}
      <Dialog open={isCommissionOpen} onOpenChange={setIsCommissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Commission Setup</DialogTitle>
            <DialogDescription>
              Set the commission parameters for this Court Manager. This will apply to all
              future bookings at their facilities.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">
                Commission Percentage (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  className="pl-10 h-11 bg-background border-border"
                  value={commissionPercentage}
                  onChange={(e) => setCommissionPercentage(parseFloat(e.target.value))}
                  min={0}
                  max={100}
                />
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              </div>
              <p className="text-xs text-text-muted">
                The percentage taken from each booking total.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCommissionOpen(false)}
              className="border-border"
              disabled={updatingCommission}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#10b981] hover:bg-[#059669] text-white"
              onClick={handleUpdateCommission}
              disabled={updatingCommission}
            >
              {updatingCommission ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}