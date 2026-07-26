"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import AdminChatView from "./AdminChatView";
import { Users, UserCog, MessageSquare, MoreVertical, Eye, CheckCircle } from "lucide-react";
import type {
  AdminSupportTicket,
  AdminSupportStats,
} from "@/types/AdminSupport.type";
import { useAdminSupportSocket } from "@/hooks/useAdminSupportSocket";
import { adminUpdateTicketStatusAction } from "@/actions/admin-support.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSupportBadge } from "@/context/SupportBadgeContext";

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    open: { label: "Open", className: "bg-red-100 text-red-800" },
    in_progress: {
      label: "In Progress",
      className: "bg-blue-100 text-blue-800",
    },
    resolved: { label: "Resolved", className: "bg-green-100 text-green-800" },
  };
  const { label, className } = statusMap[status] || statusMap.open;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

const StatusOptions = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

const AudienceTabs = [
  { id: "users", label: "AthlonGo Users", icon: Users },
  { id: "managers", label: "Court Managers", icon: UserCog },
];

interface AdminSupportClientProps {
  initialTickets: AdminSupportTicket[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null;
  stats: AdminSupportStats | null;
  audience: "users" | "managers";
  errorMessage?: string;
  statsError?: string;
}

export default function AdminSupportClient({
  initialTickets,
  pagination,
  stats,
  audience = "users",
  errorMessage,
  statsError,
}: AdminSupportClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTicket, setSelectedTicket] =
    useState<AdminSupportTicket | null>(null);
  const [chatViewOpen, setChatViewOpen] = useState(false);
  const [liveTickets, setLiveTickets] =
    useState<AdminSupportTicket[]>(initialTickets);
  const [isConnected, setIsConnected] = useState(false);
  
  // ── Get badge data from context ──
  const { userUnread, managerUnread, isConnected: badgeConnected } = useSupportBadge();
  
  // Resolve dialog states
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolvingTicket, setResolvingTicket] = useState<AdminSupportTicket | null>(null);
  const [resolving, setResolving] = useState(false);

  // Socket for real-time updates
  const { isConnected: socketConnected } = useAdminSupportSocket({
    onNewTicket: (ticket) => {
      setLiveTickets((prev) => [ticket, ...prev]);
      toast.info(`New ticket from ${ticket.user.full_name}`);
    },
    onReply: (data) => {
      setLiveTickets((prev) =>
        prev.map((t) =>
          t.code === data.ticket_code
            ? {
                ...t,
                reply_count: t.reply_count + 1,
                status: data.status as any,
              }
            : t,
        )
      );
      if (selectedTicket && data.ticket_code === selectedTicket.code) {
        // The chat view will handle this via its own socket listener
      }
    },
    onStatus: (data) => {
      setLiveTickets((prev) =>
        prev.map((t) =>
          t.code === data.code
            ? { ...t, status: data.status as any, locked: data.locked }
            : t,
        )
      );
      if (selectedTicket && data.code === selectedTicket.code) {
        setSelectedTicket((prev) =>
          prev
            ? { ...prev, status: data.status as any, locked: data.locked }
            : null,
        );
      }
    },
  });

  useEffect(() => {
    setIsConnected(socketConnected);
  }, [socketConnected]);

  useEffect(() => {
    setLiveTickets(initialTickets);
  }, [initialTickets]);

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("audience", tabId);
    params.delete("page");
    router.push(`/dashboard/support?${params.toString()}`);
  };

  const handleOpenChat = (ticket: AdminSupportTicket) => {
    setSelectedTicket(ticket);
    setChatViewOpen(true);
  };

  const handleCloseChat = () => {
    setChatViewOpen(false);
    setSelectedTicket(null);
    router.refresh();
  };

  const handleResolveClick = (ticket: AdminSupportTicket) => {
    if (ticket.status === 'resolved') {
      toast.info('This ticket is already resolved');
      return;
    }
    setResolvingTicket(ticket);
    setResolveDialogOpen(true);
  };

  const handleResolveConfirm = async () => {
    if (!resolvingTicket) return;
    
    setResolving(true);
    const res = await adminUpdateTicketStatusAction(resolvingTicket.code, { status: 'resolved' });
    
    if (res.success) {
      toast.success(res.data.message);
      setLiveTickets((prev) =>
        prev.map((t) =>
          t.code === resolvingTicket.code
            ? { ...t, status: 'resolved' as any, locked: true }
            : t,
        )
      );
      setResolveDialogOpen(false);
      setResolvingTicket(null);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setResolving(false);
  };

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {errorMessage}
      </div>
    );
  }

  return (
    <>
      {/* Tabs with Unread Counts */}
      <div className="flex items-center space-x-6 border-b border-border">
        {AudienceTabs.map((tab) => {
          const Icon = tab.icon;
          // Get unread count based on tab
          const unreadCount = tab.id === "users" ? userUnread : managerUnread;
          const hasUnread = unreadCount > 0;
          
          return (
            <button
              key={tab.id}
              className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                audience === tab.id
                  ? "text-[#10b981]"
                  : "text-text-muted hover:text-text"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              
              {/* Unread Badge */}
              {hasUnread && (
                <span className={cn(
                  "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-bold",
                  audience === tab.id
                    ? "bg-[#10b981] text-white"
                    : "bg-red-500 text-white"
                )}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              
              {audience === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#10b981] rounded-t-full" />
              )}
            </button>
          );
        })}
        {isConnected && (
          <span className="ml-auto inline-flex items-center text-xs text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Live
          </span>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center leading-none">
          <p className="text-3xl font-bold text-text">{stats?.total ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Total Tickets</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center leading-none">
          <p className="text-3xl font-bold text-red-500">{stats?.open ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Open</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center leading-none">
          <p className="text-3xl font-bold text-blue-500">
            {stats?.in_progress ?? 0}
          </p>
          <p className="text-sm font-medium text-text-muted">In Progress</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center leading-none">
          <p className="text-3xl font-bold text-green-500">
            {stats?.resolved ?? 0}
          </p>
          <p className="text-sm font-medium text-text-muted">Resolved</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchInput
            name="search"
            placeholder="Search tickets by code, subject, or user..."
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

      {statsError && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          {statsError}
        </div>
      )}

      {/* Table */}
      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text font-medium border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 w-[100px]">
                  Ticket ID
                </th>
                <th scope="col" className="px-6 py-4">
                  User
                </th>
                <th scope="col" className="px-6 py-4">
                  Subject
                </th>
                <th scope="col" className="px-6 py-4">
                  Category
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Created
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {liveTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    No tickets found.
                  </td>
                </tr>
              ) : (
                liveTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`bg-surface hover:bg-background/50 transition-colors ${
                      ticket.status === "open" ? "bg-red-50/20" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-text font-medium text-xs whitespace-nowrap">
                      {ticket.code}
                      {ticket.status === "open" && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">
                        {ticket.user.full_name}
                      </div>
                      <div className="text-text-muted mt-0.5 text-xs">
                        {ticket.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text font-medium max-w-[150px] truncate">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                      {ticket.category_display}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-text-muted text-xs whitespace-nowrap">
                      {new Date(ticket.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/support/${ticket.code}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Chat</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleResolveClick(ticket)}
                            className="flex items-center gap-2 cursor-pointer text-green-600 hover:text-green-700"
                            disabled={ticket.status === 'resolved'}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>{ticket.status === 'resolved' ? 'Resolved' : 'Resolve'}</span>
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

      {pagination && pagination.total_pages > 1 && (
        <Pagination total={pagination.count} pageSize={pagination.page_size} />
      )}

      {/* Chat View */}
      <AdminChatView
        open={chatViewOpen}
        onClose={handleCloseChat}
        ticket={selectedTicket}
        audience={audience}
      />

      {/* Resolve Confirmation Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to resolve this ticket? This will lock the thread and prevent further replies.
            </DialogDescription>
          </DialogHeader>
          {resolvingTicket && (
            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium">{resolvingTicket.subject}</p>
              <p className="text-xs text-slate-500">Ticket #{resolvingTicket.code}</p>
              <p className="text-xs text-slate-500">From: {resolvingTicket.user.full_name}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)} disabled={resolving}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleResolveConfirm} disabled={resolving}>
              {resolving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : null}
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}