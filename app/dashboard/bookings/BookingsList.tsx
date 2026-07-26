"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import { MapPin, CalendarDays } from "lucide-react";
import type { BookingResult, BookingStats } from "@/types/Booking.type";

const StatusBadge = ({ status }: { status: string }) => {
  let colors = "";
  if (status === "confirmed") {
    colors = "bg-green-100 text-green-800";
  } else if (status === "cancelled") {
    colors = "bg-red-100 text-red-800";
  } else if (status === "completed") {
    colors = "bg-blue-100 text-blue-800";
  } else {
    colors = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${colors}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const StatusOptions = [
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

interface BookingsListProps {
  bookings: BookingResult[];
  total: number;
  pageSize: number;
  stats: BookingStats | null;
  errorMessage?: string;
  statsError?: string;
}

export default function BookingsList({
  bookings = [],
  total = 0,
  pageSize = 20,
  stats = null,
  errorMessage,
  statsError,
}: BookingsListProps) {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">{stats?.total ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Total Bookings</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">
            {stats?.confirmed ?? 0}
          </p>
          <p className="text-sm font-medium text-text-muted">Confirmed</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">
            {stats?.cancelled ?? 0}
          </p>
          <p className="text-sm font-medium text-text-muted">Cancelled</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchInput
            name="search"
            placeholder="Search by customer, court, or location..."
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
      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text font-medium border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 w-[100px]">
                  Booking ID
                </th>
                <th scope="col" className="px-6 py-4">
                  Customer
                </th>
                <th scope="col" className="px-6 py-4">
                  Court
                </th>
                <th scope="col" className="px-6 py-4">
                  Location
                </th>
                <th scope="col" className="px-6 py-4">
                  Date
                </th>
                <th scope="col" className="px-6 py-4">
                  Time
                </th>
                <th scope="col" className="px-6 py-4">
                  Duration
                </th>
                <th scope="col" className="px-6 py-4">
                  Price
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="bg-surface hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-text font-medium text-xs whitespace-nowrap">
                      {booking.code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">
                        {booking.customer.name}
                      </div>
                      <div className="text-text-muted mt-0.5 text-xs">
                        {booking.customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">
                        {booking.court.facility}
                      </div>
                      <div className="text-text font-medium text-sm mt-0.5">
                        - {booking.court.name}
                      </div>
                      <div className="text-text-muted mt-0.5 text-xs capitalize">
                        {booking.court.sport}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-text-muted" />
                        {booking.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <CalendarDays className="h-3.5 w-3.5 text-text-muted" />
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap text-xs">
                      {booking.time}
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap text-xs">
                      {booking.duration} hour{booking.duration > 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600 whitespace-nowrap">
                      €{parseFloat(booking.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/bookings/${booking.code}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3"
                        >
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

      <Pagination total={total} pageSize={pageSize} />
    </>
  );
}
