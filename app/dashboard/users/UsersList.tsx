// app/dashboard/users/UsersList.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import {
  Download,
  Loader2,
  MoreVertical,
  Eye,
  UserX,
  UserCheck,
} from "lucide-react";
import UserActionDialog from "./UserActionDialog";
import type { UserResult } from "@/types/User.type";
import { exportUsersAction } from "@/actions/user.action";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const StatusOptions = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

interface UsersListProps {
  users: UserResult[];
  total: number;
  errorMessage?: string;
}

export default function UsersList({
  users = [],
  total = 0,
  errorMessage,
}: UsersListProps) {
  const [actionUser, setActionUser] = useState<UserResult | null>(null);
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(
    null,
  );
  const [exporting, setExporting] = useState(false);

  const handleAction = (type: "suspend" | "activate", user: UserResult) => {
    setActionUser(user);
    setActionType(type);
  };

  const handleActionComplete = () => {
    setActionType(null);
    setActionUser(null);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportUsersAction();

      if (result.success) {
        // Create a blob from the CSV data
        const blob = new Blob([result.data], {
          type: "text/csv;charset=utf-8;",
        });

        // Create download link
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `users_export_${new Date().toISOString().split("T")[0]}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.error("Export failed:", result.message);
        toast.error(`Export failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export users. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {/* Search and Filters */}
      <Card className="flex flex-col sm:flex-row items-center gap-4 p-4 border-none shadow-sm rounded-2xl bg-surface">
        <div className="flex-1 w-full">
          <SearchInput
            name="search"
            placeholder="Search users by name or email..."
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SelectFilter
            name="status"
            placeholder="All Status"
            options={StatusOptions}
          />
          <Button
            variant="outline"
            className="w-full sm:w-auto h-10 shadow-none"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </Card>

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
                  Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Email & Phone
                </th>
                <th scope="col" className="px-6 py-4">
                  Matches
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Join Date
                </th>
                <th scope="col" className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-surface hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.photo_url === "" ? (
                          <div
                            className={`h-10 w-10 flex items-center justify-center rounded-full text-white font-medium bg-primary`}
                          >
                            {user.full_name?.charAt(0) || user.email?.charAt(0)}
                          </div>
                        ) : (
                          <>
                            <Image
                              width={30}
                              height={30}
                              src={user.photo_url}
                              alt="User Photo"
                              className="h-10 w-10 flex items-center justify-center rounded-full text-white font-medium bg-primary"
                            />
                          </>
                        )}

                        <span className="font-medium text-text">
                          {user.full_name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text">{user.email}</div>
                      <div className="text-text-muted text-xs mt-1">
                        {user.phone_number || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text font-medium">
                      {user.matches}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(user.date_joined).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
                              href={`/dashboard/users/${user.id}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (user.status === "active") {
                                handleAction("suspend", user);
                              } else {
                                handleAction("activate", user);
                              }
                            }}
                            className={`flex items-center gap-2 cursor-pointer ${
                              user.status === "active"
                                ? "text-red-600 hover:text-red-700"
                                : "text-green-600 hover:text-green-700"
                            }`}
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="h-4 w-4" />
                                <span>Suspend User</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4" />
                                <span>Activate User</span>
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
      <UserActionDialog
        open={actionType !== null}
        onOpenChange={() => setActionType(null)}
        type={actionType || "suspend"}
        user={actionUser}
        onComplete={handleActionComplete}
      />
    </>
  );
}
