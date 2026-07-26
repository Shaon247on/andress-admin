"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MapPin,
  UserCog,
  MessageSquare,
  FileText,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  Crown,
  EuroIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DashboardData } from "@/types/Dashboard.type";

const StatusBadge = ({ status }: { status: string }) => {
  const isConfirmed = status === "confirmed";
  const isPending = status === "pending";
  let colors = "bg-gray-100 text-gray-800";

  if (isConfirmed) {
    colors = "bg-green-100 text-green-800";
  } else if (isPending) {
    colors = "bg-yellow-100 text-yellow-800";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ── Dynamic Summary Card Component ──
interface SummaryCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  href: string;
  valueColor?: string;
}

const SummaryCard = ({
  title,
  value,
  description,
  icon,
  iconBgColor,
  iconTextColor,
  href,
  valueColor = "text-text",
}: SummaryCardProps) => {
  return (
    <Link href={href}>
      <Card className="flex flex-row items-center p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <p className="text-xs text-text-muted mt-2">{description}</p>
        </div>
        <div
          className={`h-12 w-12 rounded-xl ${iconBgColor} flex items-center justify-center ${iconTextColor}`}
        >
          {icon}
        </div>
      </Card>
    </Link>
  );
};

// ── Top Earned Court Managers Component ──
interface TopCourtManager {
  id: string;
  name: string;
  email: string;
  totalEarnings: number;
  courtCount: number;
}

const TopCourtManagers = ({ managers }: { managers: TopCourtManager[] }) => {
  return (
    <Card className="border-none shadow-sm rounded-2xl bg-surface">
      <div className="flex items-center justify-between p-6 pb-2">
        <CardTitle className="text-base font-semibold">
          Top Earned Court Managers
        </CardTitle>
        <Link href="/dashboard/court-managers">
          <Button
            variant="outline"
            size="sm"
            className="h-8 shadow-none bg-background text-text"
          >
            View All
          </Button>
        </Link>
      </div>
      <CardContent>
        <div className="space-y-4 pt-2">
          {managers.map((manager, index) => (
            <div
              key={manager.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6">
                  {index === 0 ? (
                    <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <span className="text-sm font-medium text-text-muted">
                      #{index + 1}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-text">{manager.name}</p>
                  <p className="text-xs text-text-muted">{manager.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  €{manager.totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-text-muted">
                  {manager.courtCount} courts
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardOverviewProps {
  data: DashboardData | null;
  errorMessage?: string;
}

export default function DashboardOverview({
  data,
  errorMessage,
}: DashboardOverviewProps) {
  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {errorMessage}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { cards, booking_trend, todays_bookings } = data;

  // ── Static data for request stats (since API doesn't provide these) ──
  const requestStats = {
    total_requests: 245,
    pending_requests: 18,
    approved_requests: 196,
    rejected_requests: 31,
  };

  // ── Static data for pending payments ──
  const pendingPayments = {
    total_pending: 12,
    total_amount: 2847.5,
    overdue: 3,
  };

  // ── Static data for top earned court managers ──
  const topCourtManagers: TopCourtManager[] = [
    {
      id: "1",
      name: "Aminul Islam Shaon",
      email: "i664x1kagv@lnovic.com",
      totalEarnings: 31595,
      courtCount: 26,
    },
    {
      id: "2",
      name: "Arena FC",
      email: "testmgr@test.athlongo",
      totalEarnings: 7340,
      courtCount: 5,
    },
    {
      id: "3",
      name: "Chutiya Jubi",
      email: "ddsc628dwj@bwmyga.com",
      totalEarnings: 3000,
      courtCount: 9,
    },
    {
      id: "4",
      name: "Demo Arena",
      email: "demomgr@profileseed.athlongo",
      totalEarnings: 1460,
      courtCount: 3,
    },
    {
      id: "5",
      name: "John Doe",
      email: "wpchxizdgz@bwmyga.com",
      totalEarnings: 1107.5,
      courtCount: 3,
    },
  ];

  // ── Main cards data (first 2 rows) ──
  const mainCards = [
    {
      title: "Total Users",
      value: cards.total_users,
      description: "AthlonGo Application",
      icon: <Users className="h-6 w-6" />,
      iconBgColor: "bg-primary/10",
      iconTextColor: "text-primary",
      href: "/dashboard/users",
    },
    {
      title: "Court Managers",
      value: cards.court_managers,
      description: "Active accounts",
      icon: <UserCog className="h-6 w-6" />,
      iconBgColor: "bg-blue-100",
      iconTextColor: "text-blue-600",
      href: "/dashboard/court-managers",
    },
    {
      title: "Total Courts",
      value: cards.total_courts,
      description: "Registered facilities",
      icon: <MapPin className="h-6 w-6" />,
      iconBgColor: "bg-emerald-100",
      iconTextColor: "text-emerald-600",
      href: "/dashboard/courts",
    },
    {
      title: "Active Bookings",
      value: cards.active_bookings,
      description: "This month",
      icon: <CalendarDays className="h-6 w-6" />,
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-600",
      href: "/dashboard/bookings",
    },
    {
      title: "Support Messages",
      value: cards.support_messages,
      description: "Unread messages",
      icon: <MessageSquare className="h-6 w-6" />,
      iconBgColor: "bg-pink-100",
      iconTextColor: "text-pink-600",
      href: "/dashboard/support",
    },
  ];

  // ── Request cards data (last row) ──
  const requestCards = [
    {
      title: "Total Requests",
      value: requestStats.total_requests,
      description: "All time requests",
      icon: <FileText className="h-6 w-6" />,
      iconBgColor: "bg-slate-100",
      iconTextColor: "text-slate-600",
      href: "/dashboard/requests",
    },
    {
      title: "Court Manager Requests",
      value: requestStats.pending_requests,
      description: "Awaiting response",
      icon: <Clock className="h-6 w-6" />,
      iconBgColor: "bg-amber-100",
      iconTextColor: "text-amber-600",
      href: "/dashboard/requests?status=pending",
      valueColor: "text-amber-600",
    },
    {
      title: "Pending Payments",
      value: pendingPayments.total_pending,
      description: `€${pendingPayments.total_amount.toLocaleString()} total • ${pendingPayments.overdue} overdue`,
      icon: <EuroIcon className="h-6 w-6" />,
      iconBgColor: "bg-orange-100",
      iconTextColor: "text-orange-600",
      href: "/dashboard/payments",
      valueColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Dashboard Overview
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Main Summary Cards - First 2 Rows */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mainCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
        {requestCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Request & Payment Summary Cards - Last Row */}
      {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"></div> */}

      {/* Middle Grid - Booking Trend & Top Court Managers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Trend */}
        <Card className="border-none shadow-sm rounded-2xl bg-surface">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Booking Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={booking_trend}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} bookings`,
                      "Count",
                    ]}
                    labelFormatter={(label: string) => `Day: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1DB954"
                    strokeWidth={2}
                    dot={{
                      fill: "#ffffff",
                      stroke: "#1DB954",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Earned Court Managers */}
        <TopCourtManagers managers={topCourtManagers} />
      </div>

      {/* Today's Bookings Table */}
      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h3 className="text-base font-semibold text-text">
            Today&apos;s Bookings
          </h3>
          <Link href="/dashboard/bookings">
            <Button
              variant="outline"
              size="sm"
              className="h-8 shadow-none bg-background text-text"
            >
              See All
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-background text-text-muted font-medium border-y border-border">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Court
                </th>
                <th scope="col" className="px-6 py-3">
                  Court Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {todays_bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    No bookings for today.
                  </td>
                </tr>
              ) : (
                todays_bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="bg-surface hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-text">
                      {booking.court.facility}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {booking.court.name}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {booking.time}
                    </td>
                    <td className="px-6 py-4 text-text">
                      {booking.customer.name}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
