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
  UsersRound,
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
import type { DashboardData, TopManager } from "@/types/Dashboard.type";

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
interface TopCourtManagersProps {
  managers: TopManager[];
}

const TopCourtManagers = ({ managers }: TopCourtManagersProps) => {
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
          {managers.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">
              No manager data available
            </div>
          ) : (
            managers.map((manager, index) => (
              <div
                key={manager.manager_id}
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
                    <p className="font-medium text-text">{manager.manager}</p>
                    <p className="text-xs text-text-muted">
                      {manager.bookings} bookings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    €{parseFloat(manager.revenue).toLocaleString()}
                  </p>
                  <p className="text-xs text-text-muted">
                    {manager.bookings} bookings
                  </p>
                </div>
              </div>
            ))
          )}
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

  const { cards, booking_trend, top_managers_by_revenue, todays_bookings } = data;

  // ── Main cards data ──
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

  // ── Request cards data ──
  const requestCards = [
    {
      title: "Active Staff",
      value: cards.active_staff || 0,
      description: "Active staff members",
      icon: <UsersRound className="h-6 w-6" />,
      iconBgColor: "bg-indigo-100",
      iconTextColor: "text-indigo-600",
      href: "/dashboard/staff",
    },
    {
      title: "Court Manager Request",
      value: cards.pending_requests,
      description: "Awaiting response",
      icon: <Clock className="h-6 w-6" />,
      iconBgColor: "bg-amber-100",
      iconTextColor: "text-amber-600",
      href: "/dashboard/requests?status=pending",
      valueColor: "text-amber-600",
    },
    {
      title: "Pending Payments",
      value: cards.pending_payments || 0,
      description: "Pending payment requests",
      icon: <EuroIcon className="h-6 w-6" />,
      iconBgColor: "bg-orange-100",
      iconTextColor: "text-orange-600",
      href: "/dashboard/payments",
      valueColor: "text-orange-600",
    },
  ];

  // Combine all cards
  const allCards = [...mainCards, ...requestCards];

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

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

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
                    allowDecimals={false}
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
        <TopCourtManagers managers={top_managers_by_revenue || []} />
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
                  Booking Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Court
                </th>
                <th scope="col" className="px-6 py-3">
                  Club
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
                    colSpan={6}
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
                      {booking.code}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {booking.court.name}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {booking.court.club_name || booking.court.facility}
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