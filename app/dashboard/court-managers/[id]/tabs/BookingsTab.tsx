"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/elements/card";
import Pagination from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";
import { getBookingsTabAction } from "@/actions/court-manager.action";
import type { BookingItem, PaginationInfo } from "@/types/CourtManager.type";
import { toast } from "sonner";

const BookingStatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        statusMap[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

interface BookingsTabProps {
  managerId: string;
}

export default function BookingsTab({ managerId }: BookingsTabProps) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [cards, setCards] = useState({
    total_bookings: 0,
    available_slots: 0,
    utilization: 0,
  });
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
      const res = await getBookingsTabAction(managerId, currentPage);
      if (res.success) {
        setBookings(res.data.bookings);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
          <p className="text-sm text-text-muted font-medium">Total Bookings</p>
          <p className="text-3xl font-bold text-text mt-2">
            {cards.total_bookings}
          </p>
        </Card>
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
          <p className="text-sm text-text-muted font-medium">Available Slots</p>
          <p className="text-3xl font-bold text-[#10b981] mt-2">
            {cards.available_slots}
          </p>
        </Card>
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
          <p className="text-sm text-text-muted font-medium">Utilization</p>
          <p className="text-3xl font-bold text-[#3b82f6] mt-2">
            {cards.utilization}%
          </p>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="p-6 pb-2 border-b border-border text-base font-semibold text-text">
          All Bookings & Lessons
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Court</th>
                <th className="px-6 py-4 font-medium">Players</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-text">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {booking.start_time.slice(0, 5)} -{" "}
                      {booking.end_time.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                        {booking.court}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-text">
                        {booking.players.join(", ")}
                      </p>
                      <p className="text-xs text-text-muted">
                        {booking.player_count} player(s)
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-text">
                        €{parseFloat(booking.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-text-muted capitalize">
                        {booking.payment_type}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <BookingStatusBadge status={booking.status} />
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