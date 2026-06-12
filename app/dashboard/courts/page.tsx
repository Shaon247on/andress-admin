"use client";

import React, { useState } from 'react';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Search, Filter, MapPin, ChevronDown } from 'lucide-react';

const courtsData = [
  { id: 'C001', name: 'Court A', facility: 'Elite Sports Complex', manager: 'Sarah Johnson', location: 'New York, NY', type: 'Indoor', price: '$45', bookings: 342, status: 'Active', availability: 'Available' },
  { id: 'C002', name: 'Court B', facility: 'Elite Sports Complex', manager: 'Sarah Johnson', location: 'New York, NY', type: 'Indoor', price: '$45', bookings: 298, status: 'Active', availability: 'Available' },
  { id: 'C003', name: 'Court A', facility: 'Downtown Courts', manager: 'Michael Chen', location: 'New York, NY', type: 'Indoor', price: '$50', bookings: 276, status: 'Active', availability: 'Booked' },
  { id: 'C004', name: 'Court B', facility: 'Downtown Courts', manager: 'Michael Chen', location: 'New York, NY', type: 'Indoor', price: '$50', bookings: 254, status: 'Active', availability: 'Available' },
  { id: 'C005', name: 'Court A', facility: 'Riverside Arena', manager: 'Emma Williams', location: 'New York, NY', type: 'Both', price: '$55', bookings: 412, status: 'Active', availability: 'Available' },
  { id: 'C006', name: 'Court B', facility: 'Riverside Arena', manager: 'Emma Williams', location: 'New York, NY', type: 'Outdoor', price: '$55', bookings: 398, status: 'Active', availability: 'Booked' },
  { id: 'C007', name: 'Court C', facility: 'Riverside Arena', manager: 'Emma Williams', location: 'New York, NY', type: 'Indoor', price: '$40', bookings: 187, status: 'Available', availability: 'Available' },
];

const StatusBadge = ({ value, type }: { value: string, type: 'status' | 'availability' }) => {
  let colors = '';
  if (type === 'status') {
    colors = (value === 'Active' || value === 'Available')
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  } else {
    // Availability
    colors = value === 'Available'
      ? 'bg-green-100 text-green-800'
      : 'bg-blue-100 text-blue-800'; // Booked
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${colors}`}>
      {value}
    </span>
  );
};

export default function AllCourtsPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">All Courts</h1>
        <p className="text-sm text-text-muted mt-1">View and manage all courts across the platform</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">7</p>
          <p className="text-sm font-medium text-text-muted">Total Courts</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">6</p>
          <p className="text-sm font-medium text-text-muted">Active Courts</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">1</p>
          <p className="text-sm font-medium text-text-muted">In Maintenance</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">4</p>
          <p className="text-sm font-medium text-text-muted">Available Now</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search courts by name, facility, type, or location..."
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
                Active
              </button>
              <button
                className="text-left px-4 py-2 hover:bg-background text-sm text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Booked
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
                <th scope="col" className="px-6 py-4">Court ID</th>
                <th scope="col" className="px-6 py-4">Court Name</th>
                <th scope="col" className="px-6 py-4">Facility</th>
                <th scope="col" className="px-6 py-4">Manager</th>
                <th scope="col" className="px-6 py-4">Location</th>
                <th scope="col" className="px-6 py-4">Type</th>
                <th scope="col" className="px-6 py-4">Price/Hour</th>
                <th scope="col" className="px-6 py-4">Bookings</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courtsData.map((court) => (
                <tr key={court.id} className="bg-surface hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-text font-medium text-xs whitespace-nowrap">{court.id}</td>
                  <td className="px-6 py-4 text-text font-medium whitespace-nowrap">{court.name}</td>
                  <td className="px-6 py-4 text-text whitespace-normal max-w-[150px] leading-tight">
                    {court.facility}
                  </td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap">{court.manager}</td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-text-muted" />
                      {court.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 text-xs rounded-lg font-medium">
                      {court.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text font-medium">{court.price}</td>
                  <td className="px-6 py-4 text-text font-medium">{court.bookings}</td>
                  <td className="px-6 py-4">
                    <StatusBadge value={court.status} type="status" />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge value={court.availability} type="availability" />
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
