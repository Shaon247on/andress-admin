"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Search, Filter, Building2, UserCheck, MapPin, DollarSign, Mail } from 'lucide-react';

const managers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@elitesports.com', venue: 'Elite Sports Complex', location: 'New York, NY', courts: 8, bookings: 342, revenue: '$12,450', status: 'Active' },
  { id: 2, name: 'Michael Chen', email: 'michael@downtowncourts.com', venue: 'Downtown Courts', location: 'Los Angeles, CA', courts: 6, bookings: 268, revenue: '$12,450', status: 'Active' },
  { id: 3, name: 'Emma Williams', email: 'emma@riversidearena.com', venue: 'Riverside Arena', location: 'Chicago, IL', courts: 10, bookings: 425, revenue: '$15,200', status: 'Active' },
  { id: 4, name: 'James Martinez', email: 'james@summitsports.com', venue: 'Summit Sports Center', location: 'Houston, TX', courts: 5, bookings: 198, revenue: '$7,650', status: 'Active' },
  { id: 5, name: 'Lisa Anderson', email: 'lisa@parksidecourts.com', venue: 'Parkside Courts', location: 'Phoenix, AZ', courts: 4, bookings: 156, revenue: '$6,240', status: 'Inactive' },
  { id: 6, name: 'David Brown', email: 'david@coastalcourts.com', venue: 'Coastal Courts', location: 'Miami, FL', courts: 7, bookings: 289, revenue: '$10,550', status: 'Active' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === 'Active';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

export default function CourtManagersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredManagers = managers.filter(manager => {
    const matchesSearch = manager.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          manager.venue.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          manager.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || manager.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Court Managers</h1>
        <p className="text-sm text-text-muted mt-1">Manage all court managers on the platform</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-[#e2f5ec] flex items-center justify-center text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">6</p>
            <p className="text-sm font-medium text-text-muted mt-1">Total Managers</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-[#e2f5ec] flex items-center justify-center text-primary">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">5</p>
            <p className="text-sm font-medium text-text-muted mt-1">Active Managers</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-[#e2f5ec] flex items-center justify-center text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">40</p>
            <p className="text-sm font-medium text-text-muted mt-1">Total Courts</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-[#e2f5ec] flex items-center justify-center text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">$55.7k</p>
            <p className="text-sm font-medium text-text-muted mt-1">Monthly Revenue</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search by name, venue, or location..." 
            className="pl-9 bg-surface border-border h-11 w-full rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon" className="h-11 w-11 bg-surface border-border rounded-xl shrink-0">
            <Filter className="h-5 w-5 text-text-muted" />
          </Button>
          <select 
            className="h-11 px-3 bg-surface border border-border rounded-xl text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none pr-8 cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text font-medium border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4">Manager</th>
                <th scope="col" className="px-6 py-4">Venue</th>
                <th scope="col" className="px-6 py-4">Location</th>
                <th scope="col" className="px-6 py-4">Courts</th>
                <th scope="col" className="px-6 py-4">Bookings</th>
                <th scope="col" className="px-6 py-4">Revenue</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-text-muted">
                    No court managers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager) => (
                  <tr key={manager.id} className="bg-surface hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{manager.name}</div>
                      <div className="text-text-muted flex items-center gap-1 mt-1 text-xs">
                        <Mail className="h-3 w-3" /> {manager.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text">{manager.venue}</td>
                    <td className="px-6 py-4 text-text-muted max-w-[120px] whitespace-normal">
                      {manager.location}
                    </td>
                    <td className="px-6 py-4 text-text font-medium">{manager.courts}</td>
                    <td className="px-6 py-4 text-text font-medium">{manager.bookings}</td>
                    <td className="px-6 py-4 text-text font-medium">{manager.revenue}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={manager.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/court-managers/${manager.id}`}>
                        <Button variant="outline" size="sm" className="h-8 shadow-none bg-background text-text">
                          View Details
                        </Button>
                      </Link>
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

