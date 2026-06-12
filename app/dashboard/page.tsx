"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Calendar, TrendingUp, Users, DollarSign, MapPin, UserCog, MessageSquare, FileText, CalendarDays } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const chartData = [
  { name: 'Mon', value: 8 },
  { name: 'Tue', value: 12 },
  { name: 'Wed', value: 10 },
  { name: 'Thu', value: 15 },
  { name: 'Fri', value: 18 },
  { name: 'Sat', value: 22 },
  { name: 'Sun', value: 20 },
];

const utilizationData = [
  { name: 'Arena Pro', percentage: 85 },
  { name: 'Gemna Silva', percentage: 72 },
  { name: 'Stadium Pro', percentage: 68 },
  { name: 'Flora Stadium', percentage: 91 },
];

const todaysBookings = [
  { id: 1, court: 'Court A - Elite Sports', courtName: 'Court D', time: '09:00 AM', customer: 'John Smith', status: 'Confirmed' },
  { id: 2, court: 'Court B - Downtown Courts', courtName: 'Court A', time: '10:30 AM', customer: 'Emily Davis', status: 'Confirmed' },
  { id: 3, court: 'Court C - Riverside Arena', courtName: 'Court D', time: '02:00 PM', customer: 'Michael Brown', status: 'Pending' },
  { id: 4, court: 'Court A - Elite Sports', courtName: 'Court C', time: '04:00 PM', customer: 'Sarah Wilson', status: 'Confirmed' },
  { id: 5, court: 'Court D - City Sports Hub', courtName: 'Court B', time: '06:30 PM', customer: 'David Lee', status: 'Confirmed' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const isConfirmed = status === 'Confirmed';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {status}
    </span>
  );
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Dashboard Overview</h1>
        <p className="text-sm text-text-muted mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/users">
          <Card className="flex flex-row items-center p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-text-muted">Total Users</p>
              <p className="text-2xl font-bold text-text">12,543</p>
              <p className="text-xs text-text-muted mt-2">AthlonGo Application</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-6 w-6" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/requests">
          <Card className="flex flex-row items-center p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-text-muted">Pending Requests</p>
              <p className="text-2xl font-bold text-text">43</p>
              <p className="text-xs text-text-muted mt-2">Awaiting response</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FileText className="h-6 w-6" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/court-managers">
          <Card className="flex flex-row items-center p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-text-muted">Court Managers</p>
              <p className="text-2xl font-bold text-text">156</p>
              <p className="text-xs text-text-muted mt-2">Active accounts</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <UserCog className="h-6 w-6" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/courts">
          <Card className="flex flex-row items-center p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-text-muted">Total Courts</p>
              <p className="text-2xl font-bold text-text">342</p>
              <p className="text-xs text-text-muted mt-2">Registered facilities</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <MapPin className="h-6 w-6" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/bookings">
          <Card className="flex flex-row items-center p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-text-muted">Active Bookings</p>
              <p className="text-2xl font-bold text-text">1,204</p>
              <p className="text-xs text-text-muted mt-2">This month</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <CalendarDays className="h-6 w-6" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/support">
          <Card className="flex flex-row items-center p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-text-muted">Support Messages</p>
              <p className="text-2xl font-bold text-text">28</p>
              <p className="text-xs text-text-muted mt-2">Unread messages</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
              <MessageSquare className="h-6 w-6" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Middle Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Trend */}
        <Card className="border-none shadow-sm rounded-2xl bg-surface">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Booking Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1DB954" 
                    strokeWidth={2} 
                    dot={{ fill: '#ffffff', stroke: '#1DB954', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Court Utilization */}
        <Card className="border-none shadow-sm rounded-2xl bg-surface">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Court Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 pt-2">
              {utilizationData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-text">{item.name}</span>
                    <span className="text-text-muted">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings Table */}
      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h3 className="text-base font-semibold text-text">Today&apos;s Bookings</h3>
          <Button variant="outline" size="sm" className="h-8 shadow-none bg-background text-text">
            See All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-background text-text-muted font-medium border-y border-border">
              <tr>
                <th scope="col" className="px-6 py-3">Court</th>
                <th scope="col" className="px-6 py-3">Court Name</th>
                <th scope="col" className="px-6 py-3">Time</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {todaysBookings.map((booking) => (
                <tr key={booking.id} className="bg-surface hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">{booking.court}</td>
                  <td className="px-6 py-4 text-text-muted">{booking.courtName}</td>
                  <td className="px-6 py-4 text-text-muted">{booking.time}</td>
                  <td className="px-6 py-4 text-text">{booking.customer}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
