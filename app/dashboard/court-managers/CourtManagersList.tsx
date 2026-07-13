"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import {
  Building2,
  UserCheck,
  MapPin,
  DollarSign,
  MoreVertical,
  Eye,
  UserX,
  UserCheck as UserCheckIcon,
} from "lucide-react";
import type {
  CourtManagerResult,
  CourtManagerStats,
} from "@/types/CourtManager.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ManagerActionDialog from "./ManagerActionDialog";

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

const StatusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const OrderingOptions = [
  { label: "Revenue (High to Low)", value: "-revenue" },
  { label: "Courts (High to Low)", value: "-courts_count" },
  { label: "Name (A-Z)", value: "first_name" },
  { label: "Newest First", value: "-date_joined" },
];

interface CourtManagersListProps {
  managers: CourtManagerResult[];
  total: number;
  stats: CourtManagerStats | null;
  errorMessage?: string;
  statsError?: string;
}

export default function CourtManagersList({
  managers = [],
  total = 0,
  stats = null,
  errorMessage,
  statsError,
}: CourtManagersListProps) {
  const [actionManager, setActionManager] = useState<CourtManagerResult | null>(
    null,
  );
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(
    null,
  );

  const handleAction = (
    type: "suspend" | "activate",
    manager: CourtManagerResult,
  ) => {
    setActionManager(manager);
    setActionType(type);
  };

  const handleActionComplete = () => {
    setActionType(null);
    setActionManager(null);
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-[#e2f5ec] flex items-center justify-center text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">
              {stats?.total_managers ?? 0}
            </p>
            <p className="text-sm font-medium text-text-muted mt-1">
              Total Managers
            </p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-[#e2f5ec] flex items-center justify-center text-primary">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">
              {stats?.active_managers ?? 0}
            </p>
            <p className="text-sm font-medium text-text-muted mt-1">
              Active Managers
            </p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-[#e2f5ec] flex items-center justify-center text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">
              {stats?.total_courts ?? 0}
            </p>
            <p className="text-sm font-medium text-text-muted mt-1">
              Total Courts
            </p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-[#e2f5ec] flex items-center justify-center text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">
              ${(stats?.total_revenue ?? 0).toLocaleString()}
            </p>
            <p className="text-sm font-medium text-text-muted mt-1">
              Total Revenue
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchInput
            name="search"
            placeholder="Search by name, venue, or location..."
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="max-w-1/2">
            <SelectFilter
              name="status"
              placeholder="All Status"
              options={StatusOptions}
            />
          </div>

          <div className="max-w-1/2">
            <SelectFilter
              className="max-w-[40px]"
              name="ordering"
              placeholder="Sort By"
              options={OrderingOptions}
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
                  Manager
                </th>
                <th scope="col" className="px-6 py-4">
                  Venue
                </th>
                <th scope="col" className="px-6 py-4">
                  Location
                </th>
                <th scope="col" className="px-6 py-4">
                  Courts
                </th>
                <th scope="col" className="px-6 py-4">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-4">
                  Revenue
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
              {managers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    No court managers found.
                  </td>
                </tr>
              ) : (
                managers.map((manager) => (
                  <tr
                    key={manager.id}
                    className="bg-surface hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">
                        {manager.full_name}
                      </div>
                      <div className="text-text-muted text-xs mt-1">
                        {manager.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text">{manager.venue}</td>
                    <td className="px-6 py-4 text-text-muted max-w-[120px] whitespace-normal">
                      {manager.location}
                    </td>
                    <td className="px-6 py-4 text-text font-medium">
                      {manager.courts}
                    </td>
                    <td className="px-6 py-4 text-text font-medium">
                      {manager.bookings}
                    </td>
                    <td className="px-6 py-4 text-text font-medium">
                      ${parseFloat(manager.revenue).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={manager.status} />
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-text-muted hover:text-text hover:bg-background"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl border-border bg-surface shadow-lg"
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/court-managers/${manager.id}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (manager.status === "active") {
                                handleAction("suspend", manager);
                              } else {
                                handleAction("activate", manager);
                              }
                            }}
                            className={`flex items-center gap-2 cursor-pointer ${
                              manager.status === "active"
                                ? "text-red-600 hover:text-red-700"
                                : "text-green-600 hover:text-green-700"
                            }`}
                          >
                            {manager.status === "active" ? (
                              <>
                                <UserX className="h-4 w-4" />
                                <span>Suspend Manager</span>
                              </>
                            ) : (
                              <>
                                <UserCheckIcon className="h-4 w-4" />
                                <span>Activate Manager</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination total={total} pageSize={10} />

      {/* Action Dialog */}
      <ManagerActionDialog
        open={actionType !== null}
        onOpenChange={() => setActionType(null)}
        type={actionType || "suspend"}
        manager={actionManager}
        onComplete={handleActionComplete}
      />
    </>
  );
}
