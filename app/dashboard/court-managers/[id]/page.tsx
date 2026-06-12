"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/elements/dialog';
import {
  ArrowLeft, Mail, Phone, CalendarDays, MapPin, CalendarIcon,
  DollarSign, Building2, TrendingUp, Ban, Send,
  Megaphone, CheckCircle2, Gift, MoreHorizontal, Wrench, Heart, Percent
} from 'lucide-react';

const recentBookings = [
  { id: 1, customer: 'John Smith', date: '2026-04-08', amount: 45, status: 'completed' },
  { id: 2, customer: 'Emily Davis', date: '2026-04-08', amount: 90, status: 'completed' },
  { id: 3, customer: 'Michael Brown', date: '2026-04-07', amount: 45, status: 'completed' },
];

const courtsList = [
  { id: 1, name: 'Arena Pro - Court A', location: 'Athens', type: 'Football', surface: 'Artificial Turf', status: 'Close', environment: 'Outdoor', price: 50, bookings: 145, revenue: 18450 },
  { id: 2, name: 'Arena Pro - Court B', location: 'Athens', type: 'Football', surface: 'Artificial Turf', status: 'Active', environment: 'Indoor', price: 45, bookings: 128, revenue: 15200 },
  { id: 3, name: 'Indoor Court Premium', location: 'Athens', type: 'Football', surface: 'Artificial Turf', status: 'Close', environment: 'Outdoor', price: 60, bookings: 89, revenue: 11980 },
];

const allBookings = [
  { id: 1, date: 'Apr 3, 2026', time: '09:00 - 10:00', court: 'Court 1', players: 'John Doe', playerDesc: '1 player(s)', payment: '$50', paymentType: 'Single', status: 'Bookings' },
  { id: 2, date: 'Apr 3, 2026', time: '10:00 - 11:30', court: 'Court 2', players: 'Jane Smith, Mike Johnson', playerDesc: '2 player(s)', payment: '$75', paymentType: 'Split', status: 'Lessons' },
  { id: 3, date: 'Apr 3, 2026', time: '16:00 - 17:00', court: 'Court 3', players: 'John Doe, David Brown', playerDesc: '2 player(s)', payment: '$50', paymentType: 'Split', status: 'Lessons' },
];

const customersData = [
  { id: 1, name: 'John Doe', location: 'USA', phone: '+1234567890', email: 'john@example.com', games: 45, benefits: 'None' },
  { id: 2, name: 'Jane Smith', location: 'UK', phone: '+1234567891', email: 'jane@example.com', games: 32, benefits: 'None' },
  { id: 3, name: 'Mike Johnson', location: 'Canada', phone: '+1234567892', email: 'mike@example.com', games: 28, benefits: 'None' },
  { id: 4, name: 'Sarah Williams', location: 'Australia', phone: '+1234567893', email: 'sarah@example.com', games: 56, benefits: '1 active' },
];

const teamData = [
  { id: 1, name: 'Emily Davis', email: 'emily@courtmanager.com', role: 'Receptionist', permissions: ['Schedule', 'Customers', 'Bookings'], status: 'Active' },
  { id: 2, name: 'Robert Martinez', email: 'robert@courtmanager.com', role: 'Court Supervisor', permissions: ['Schedule', 'Customers', 'Bookings', 'Tournaments'], status: 'Active' },
];

const postsData = [
  { id: 1, title: 'Special Weekend Discount — 20% Off!', tag: 'ANNOUNCEMENT', author: 'Arena Pro Management', time: '2 hours ago', content: 'Book your weekend slots now and get 20% off on all court bookings. Valid for March 10-12. Limited slots available! Use code WEEKEND20 at checkout.', likes: 45 },
  { id: 2, title: 'Court Maintenance Completed', tag: 'MAINTENANCE', tag2: 'Indoor Court Premium', author: 'Arena Pro Management', time: '2 days ago', content: 'Indoor Court Premium maintenance has been completed successfully. New artificial turf installed and lighting upgraded. Now available for bookings!', likes: 0 },
];

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'courts', label: 'Courts' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'customers', label: 'Customers' },
  { id: 'team', label: 'Team' },
  { id: 'posts', label: 'Posts' },
];

export default function CourtManagerDetailsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      <Link href="/dashboard/court-managers" className="inline-flex items-center text-sm font-medium text-text hover:text-text/80">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Managers
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Sarah Johnson</h1>
          <p className="text-sm text-text-muted mt-1">Elite Sports Complex</p>
        </div>
        <div>
          <span className="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">342</p>
            <p className="text-sm text-text-muted mt-1">Total Bookings</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">$12,450</p>
            <p className="text-sm text-text-muted mt-1">Monthly Revenue</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">8</p>
            <p className="text-sm text-text-muted mt-1">Number of Courts</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">48</p>
            <p className="text-sm text-text-muted mt-1">Total Posts</p>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border overflow-x-auto">
        <nav className="flex space-x-8 min-w-max px-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-[#10b981] text-[#10b981]'
                  : 'border-transparent text-text-muted hover:text-text hover:border-border'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] mt-6">
        {activeTab === 'overview' && (
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
                      <p className="text-sm text-text">sarah@elitesports.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted font-medium mb-1">Location</p>
                      <p className="text-sm text-text">123 Main Street, New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted font-medium mb-1">Phone</p>
                      <p className="text-sm text-text">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted font-medium mb-1">Joined</p>
                      <p className="text-sm text-text">2024-01-15</p>
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
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-background/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-text leading-none">{booking.customer}</p>
                        <p className="text-xs text-text-muted mt-2 leading-none">{booking.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-text leading-none">${booking.amount}</p>
                        <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded bg-green-100 text-green-700 leading-none">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
                    <p className="text-sm text-text">Active</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-medium mb-1">Last Active</p>
                    <p className="text-sm text-text">2026-04-08</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-medium mb-1">Member Since</p>
                    <p className="text-sm text-text">2024-01-15</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button variant="default" className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white h-11 text-sm font-medium">
                    <Ban className="mr-2 h-4 w-4" /> Suspend Account
                  </Button>
                  <Button variant="outline" className="w-full h-11 text-sm font-medium border-border shadow-none">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                  <Button variant="outline" className="w-full h-11 text-sm font-medium border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10 shadow-none" onClick={() => setIsCommissionOpen(true)}>
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
                      <span className="text-text">342</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-text rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Rating</span>
                      <span className="text-text">4.8 / 5.0</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-text rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Revenue</span>
                      <span className="text-text">$12,450</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-text rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'courts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
                <p className="text-sm text-text-muted font-medium">Total Courts</p>
                <p className="text-3xl font-bold text-text mt-2">4</p>
              </Card>
              <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
                <p className="text-sm text-text-muted font-medium">Available</p>
                <p className="text-3xl font-bold text-[#10b981] mt-2">3</p>
              </Card>
              <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
                <p className="text-sm text-text-muted font-medium">Under Maintenance</p>
                <p className="text-3xl font-bold text-[#f59e0b] mt-2">1</p>
              </Card>
            </div>

            <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
              <div className="p-6 pb-2 border-b border-border text-base font-semibold text-text">
                All Courts
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Court</th>
                      <th className="px-6 py-4 font-medium">Type / Surface</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Price/Hr</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Bookings</th>
                      <th className="px-6 py-4 font-medium">Revenue</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {courtsList.map(c => (
                      <tr key={c.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-text">{c.name}</p>
                          <p className="text-xs text-text-muted">Location: {c.location}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-text">{c.type}</p>
                          <p className="text-xs text-text-muted">{c.surface}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium w-max ${c.status === 'Active' ? 'bg-green-100 text-green-700' :
                            c.status === 'Close' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-text">€{c.price}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {c.environment}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text">{c.bookings}</td>
                        <td className="px-6 py-4 font-medium text-[#10b981]">€{c.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
                <p className="text-sm text-text-muted font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-text mt-2">4</p>
              </Card>
              <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
                <p className="text-sm text-text-muted font-medium">Available Slots</p>
                <p className="text-3xl font-bold text-[#10b981] mt-2">64</p>
              </Card>
              <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
                <p className="text-sm text-text-muted font-medium">Utilization</p>
                <p className="text-3xl font-bold text-[#3b82f6] mt-2">5.9%</p>
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
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allBookings.map(b => (
                      <tr key={b.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-text">{b.date}</td>
                        <td className="px-6 py-4 text-text-muted">{b.time}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                            {b.court}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-text">{b.players}</p>
                          <p className="text-xs text-text-muted">{b.playerDesc}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-text">{b.payment}</p>
                          <p className="text-xs text-text-muted">{b.paymentType}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold ${b.status === 'Bookings' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
              <div className="p-6 pb-2 border-b border-border text-base font-semibold text-text">
                Customers List
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Phone</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Total Games</th>
                      <th className="px-6 py-4 font-medium">Benefits</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {customersData.map(c => (
                      <tr key={c.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-text">{c.name}</p>
                          <p className="text-xs text-text-muted">{c.location}</p>
                        </td>
                        <td className="px-6 py-4 text-text-muted">{c.phone}</td>
                        <td className="px-6 py-4 text-text-muted">{c.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">
                            {c.games} games
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {c.benefits === 'None' ? (
                            <span className="text-text-muted text-sm">{c.benefits}</span>
                          ) : (
                            <span className="inline-flex px-2 py-1 rounded bg-green-50 text-green-600 text-[10px] font-bold border border-green-200">
                              <Gift className="w-3 h-3 mr-1 inline" />
                              {c.benefits}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
                <p className="text-sm text-text-muted font-medium">Active Staff</p>
                <p className="text-3xl font-bold text-text mt-2">2</p>
              </Card>
              <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
                <p className="text-sm text-text-muted font-medium">Pending Staff</p>
                <p className="text-3xl font-bold text-[#10b981] mt-2">1</p>
              </Card>
            </div>

            <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
              <div className="p-6 pb-2 border-b border-border text-base font-semibold text-text">
                Manager Team
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Permissions</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {teamData.map(t => (
                      <tr key={t.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-text">{t.name}</td>
                        <td className="px-6 py-4 text-text-muted">
                          <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {t.email}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 rounded bg-purple-50 text-purple-600 text-[10px] font-bold">
                            {t.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {t.permissions.map(p => (
                              <span key={p} className="inline-flex px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-600 text-[10px] font-bold border border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-4 max-w-4xl">
            {postsData.map(post => (
              <Card key={post.id} className="p-6 border border-border shadow-sm rounded-2xl bg-surface">
                <div className="flex gap-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${post.tag === 'ANNOUNCEMENT' ? 'bg-[#3b82f6]' : 'bg-[#64748b]'
                    }`}>
                    {post.tag === 'ANNOUNCEMENT' ? (
                      <Megaphone className="h-6 w-6 text-white" />
                    ) : (
                      <Wrench className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-text">{post.title}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wide">
                            {post.tag}
                          </span>
                          {post.tag2 && (
                            <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wide">
                              {post.tag2}
                            </span>
                          )}
                          <span className="text-xs text-text-muted font-medium">
                            {post.author} • {post.time}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-text shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {post.content}
                    </p>
                    {post.tag === 'ANNOUNCEMENT' && (
                      <div className="flex items-center gap-1.5 text-sm text-text-muted mt-2">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isCommissionOpen} onOpenChange={setIsCommissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Commission Setup</DialogTitle>
            <DialogDescription>
              Set the commission parameters for this Court Manager. This will apply to all future bookings at their facilities.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Commission Percentage (%)</label>
              <div className="relative">
                <Input type="number" placeholder="e.g., 10" className="pl-10 h-11 bg-background border-border" defaultValue={10} />
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              </div>
              <p className="text-xs text-text-muted">The percentage taken from each booking total.</p>
            </div>

            {/* <div className="space-y-2">
              <label className="text-sm font-medium text-text">Fixed Fee ($)</label>
              <div className="relative">
                <Input type="number" placeholder="e.g., 2.50" className="pl-10 h-11 bg-background border-border" defaultValue={2.50} />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              </div>
              <p className="text-xs text-text-muted">A fixed amount added on top of the percentage.</p>
            </div> */}

            {/* <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 font-medium">Example Calculation</p>
              <p className="text-xs text-blue-600 mt-1">For a $100 booking: $10 (10%) + $2.50 (Fixed) = $12.50 Commission</p>
            </div> */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommissionOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button className="bg-[#10b981] hover:bg-[#059669] text-white" onClick={() => setIsCommissionOpen(false)}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
