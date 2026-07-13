"use client";

import React from "react";
import { Card } from "@/components/elements/card";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import { MapPin } from "lucide-react";
import type { CourtResult, CourtStats } from "@/types/Court.type";

const StatusBadge = ({
  value,
  type,
}: {
  value: string;
  type: "status" | "availability";
}) => {
  let colors = "";
  if (type === "status") {
    if (value === "active") {
      colors = "bg-green-100 text-green-800";
    } else if (value === "under_maintenance") {
      colors = "bg-yellow-100 text-yellow-800";
    } else {
      colors = "bg-gray-100 text-gray-800";
    }
  } else {
    // Availability
    if (value === "available") {
      colors = "bg-green-100 text-green-800";
    } else if (value === "booked") {
      colors = "bg-blue-100 text-blue-800";
    } else {
      colors = "bg-yellow-100 text-yellow-800";
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${colors}`}
    >
      {value.replace("_", " ").charAt(0).toUpperCase() +
        value.replace("_", " ").slice(1)}
    </span>
  );
};

const StatusOptions = [
  { label: "Active", value: "active" },
  { label: "Under Maintenance", value: "under_maintenance" },
  { label: "Closed", value: "closed" },
];

const CourtTypeOptions = [
  { label: "Indoor", value: "indoor" },
  { label: "Outdoor", value: "outdoor" },
  { label: "Both", value: "both" },
];

interface CourtsListProps {
  courts: CourtResult[];
  total: number;
  stats: CourtStats | null;
  errorMessage?: string;
  statsError?: string;
}

export default function CourtsList({
  courts = [],
  total = 0,
  stats = null,
  errorMessage,
  statsError,
}: CourtsListProps) {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">{stats?.total ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Total Courts</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">{stats?.active ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Active Courts</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">
            {stats?.in_maintenance ?? 0}
          </p>
          <p className="text-sm font-medium text-text-muted">In Maintenance</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">
            {stats?.available_now ?? 0}
          </p>
          <p className="text-sm font-medium text-text-muted">Available Now</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchInput
            name="search"
            placeholder="Search courts by name, facility, type, or location..."
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div>
            <SelectFilter
            className="max-w-35 min-w-35"
              name="status"
              placeholder="All Status"
              options={StatusOptions}
            />
          </div>
          <div>
            <SelectFilter
            className="max-w-35 min-w-35"
              name="court_type"
              placeholder="All Types"
              options={CourtTypeOptions}
            />
          </div>
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
                <th scope="col" className="px-6 py-4">
                  Court ID
                </th>
                <th scope="col" className="px-6 py-4">
                  Court Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Facility
                </th>
                <th scope="col" className="px-6 py-4">
                  Manager
                </th>
                <th scope="col" className="px-6 py-4">
                  Location
                </th>
                <th scope="col" className="px-6 py-4">
                  Type
                </th>
                <th scope="col" className="px-6 py-4">
                  Price/Hour
                </th>
                <th scope="col" className="px-6 py-4">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Availability
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courts.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    No courts found.
                  </td>
                </tr>
              ) : (
                courts.map((court) => (
                  <tr
                    key={court.id}
                    className="bg-surface hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-text font-medium text-xs whitespace-nowrap">
                      {court.court_id}
                    </td>
                    <td className="px-6 py-4 text-text font-medium whitespace-nowrap">
                      {court.name}
                    </td>
                    <td className="px-6 py-4 text-text whitespace-normal max-w-[150px] leading-tight">
                      {court.facility}
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                      {court.manager}
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-text-muted" />
                        {court.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 text-xs rounded-lg font-medium capitalize">
                        {court.court_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text font-medium">
                      ${court.price_per_hour}
                    </td>
                    <td className="px-6 py-4 text-text font-medium">
                      {court.bookings}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge value={court.status} type="status" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        value={court.availability}
                        type="availability"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination total={total} pageSize={20} />
    </>
  );
}
