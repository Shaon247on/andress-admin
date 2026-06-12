"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Search, Filter, ChevronDown, MapPin, CalendarDays } from 'lucide-react';

const bookingsData = [
  { id: 'B001', customerName: 'John Smith', customerEmail: 'john.smith@email.com', facility: 'Elite Sports Complex', court: 'Court A', location: 'Chicago, IL', type: 'Tennis', date: '2026-04-09', time: '11:00 AM - 12:00 PM', duration: '1 hour', price: 45, status: 'Confirmed' },
  { id: 'B002', customerName: 'Emily Davis', customerEmail: 'emily.davis@email.com', facility: 'Downtown Courts', court: 'Court B', location: 'Chicago, IL', type: 'Basketball', date: '2026-04-09', time: '11:00 AM - 12:00 PM', duration: '1.5 hours', price: 75, status: 'Confirmed' },
  { id: 'B003', customerName: 'Michael Brown', customerEmail: 'michael.brown@email.com', facility: 'Riverside Arena', court: 'Court A', location: 'Chicago, IL', type: 'Tennis', date: '2026-04-09', time: '11:00 AM - 12:00 PM', duration: '1.5 hours', price: 82.50, status: 'Confirmed' },
  { id: 'B004', customerName: 'Sarah Wilson', customerEmail: 'sarah.wilson@email.com', facility: 'Elite Sports Complex', court: 'Court B', location: 'Chicago, IL', type: 'Tennis', date: '2026-04-09', time: '11:00 AM - 12:00 PM', duration: '1 hour', price: 45, status: 'Confirmed' },
  { id: 'B005', customerName: 'David Lee', customerEmail: 'david.lee@email.com', facility: 'City Sports Hub', court: 'Court A', location: 'Miami, FL', type: 'Basketball', date: '2026-04-09', time: '11:00 AM - 12:00 PM', duration: '1.5 hours', price: 67.50, status: 'Cancelled' },
  { id: 'B006', customerName: 'Jessica Taylor', customerEmail: 'jessica.taylor@email.com', facility: 'Riverside Arena', court: 'Court C', location: 'Chicago, IL', type: 'Badminton', date: '2026-04-09', time: '11:00 AM - 12:00 PM', duration: '1 hour', price: 40, status: 'Confirmed' },
];

const StatusBadge = ({ value }: { value: string }) => {
  let colors = '';
  if (value === 'Confirmed') {
    colors = 'bg-green-100 text-green-800'; 
  } else if (value === 'Cancelled') {
    colors = 'bg-red-100 text-red-800';
  } else {
    // Pending
    colors = 'bg-gray-100 text-gray-800'; 
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${colors}`}>
      {value}
    </span>
  );
};

export default function BookingsPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Bookings</h1>
        <p className="text-sm text-text-muted mt-1">View and manage all court bookings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">6</p>
          <p className="text-sm font-medium text-text-muted">Total Bookings</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">4</p>
          <p className="text-sm font-medium text-text-muted">Confirmed</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">1</p>
          <p className="text-sm font-medium text-text-muted">Cancelled</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search by customer, court, or location..." 
            className="pl-9 bg-surface border-border h-11 w-full rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto relative">
          <Button variant="outline" size="icon" className="h-11 w-11 bg-surface border-border rounded-xl shrink-0">
            <Filter className="h-5 w-5 text-text-muted" />
          </Button>
          <Button 
            variant="outline" 
            className="h-11 px-4 bg-surface border-border rounded-xl shrink-0 justify-between min-w-[140px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-text font-normal">All Status</span>
            <ChevronDown className="h-4 w-4 text-text-muted ml-2" />
          </Button>

          {/* Simple Dropdown UI Mock */}
          {isOpen && (
            <div className="absolute right-0 top-12 mt-1 w-48 bg-surface rounded-xl shadow-lg border border-border z-10 py-1 flex flex-col">
              <button 
                className="text-left px-4 py-2 hover:bg-background text-sm text-text"
                onClick={() => setIsOpen(false)}
              >
                All Status
              </button>
              <div className="h-px w-full bg-border" />
              <button 
                className="text-left px-4 py-2 hover:bg-background text-sm text-green-600"
                onClick={() => setIsOpen(false)}
              >
                Confirmed
              </button>
              <button 
                className="text-left px-4 py-2 hover:bg-background text-sm text-red-600"
                onClick={() => setIsOpen(false)}
              >
                Cancelled
              </button>
            </div>
          )}
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text font-medium border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 w-[100px]">Booking ID</th>
                <th scope="col" className="px-6 py-4">Customer</th>
                <th scope="col" className="px-6 py-4">Court</th>
                <th scope="col" className="px-6 py-4">Location</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4">Time</th>
                <th scope="col" className="px-6 py-4">Duration</th>
                <th scope="col" className="px-6 py-4">Price</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookingsData.map((booking) => (
                <tr key={booking.id} className="bg-surface hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-text font-medium text-xs whitespace-nowrap">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{booking.customerName}</div>
                    <div className="text-text-muted mt-0.5 text-xs">{booking.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="font-medium text-text">{booking.facility}</div>
                     <div className="text-text font-medium text-sm mt-0.5">- {booking.court}</div>
                     <div className="text-text-muted mt-0.5 text-xs">{booking.type}</div>
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
                      {booking.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap text-xs">{booking.time}</td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap text-xs">{booking.duration}</td>
                  <td className="px-6 py-4 text-text font-medium text-green-600 whitespace-nowrap">$ {booking.price}</td>
                  <td className="px-6 py-4">
                    <StatusBadge value={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/bookings/${booking.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3">
                        View
                      </Button>
                    </Link>
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
