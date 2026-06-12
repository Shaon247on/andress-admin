"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Search, ChevronDown, DollarSign, Clock, CheckCircle2, TrendingUp, Eye, XCircle } from 'lucide-react';

const paymentsData = [
  { id: 'PAY-001', manager: 'City Sports Complex', email: 'manager@citysports.com', courts: 'Courts 1-5', period: 'Feb 2024', amount: '2,500', date: '2024-03-10', status: 'Pending' },
  { id: 'PAY-002', manager: 'Grand Stadium Arena', email: 'admin@grandstadium.com', courts: 'Courts A-D', period: 'Feb 2024', amount: '4,200', date: '2024-03-09', status: 'Paid' },
  { id: 'PAY-003', manager: 'Elite Tennis Club', email: 'info@elitetennis.com', courts: 'Courts 1-3', period: 'Feb 2024', amount: '1,800', date: '2024-03-09', status: 'Paid' },
  { id: 'PAY-004', manager: 'Metro Sports Center', email: 'contact@metrosports.com', courts: 'Courts X-Z', period: 'Feb 2024', amount: '3,100', date: '2024-03-08', status: 'Pending' },
  { id: 'PAY-005', manager: 'Riverside Courts', email: 'manager@riverside.com', courts: 'Courts 1-2', period: 'Feb 2024', amount: '950', date: '2024-03-08', status: 'Rejected' },
  { id: 'PAY-006', manager: 'Downtown Athletic Club', email: 'admin@downtownathletic.com', courts: 'Courts 1-8', period: 'Feb 2024', amount: '5,600', date: '2024-03-07', status: 'Paid' },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-500">
        <Clock className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  }
  if (status === 'Paid') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-500">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
      <XCircle className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

export default function PaymentsPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Payment Management</h1>
        <p className="text-sm text-text-muted mt-1">Monitor transactions and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Primary green card */}
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-[#00c853] text-white justify-center relative overflow-hidden">
           <div className="absolute top-6 right-6">
              <TrendingUp className="w-5 h-5 opacity-80" />
           </div>
           <DollarSign className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">$575</p>
          <p className="text-sm font-medium opacity-90">Total Revenue</p>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border border-border shadow-sm rounded-2xl bg-surface justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">$86.25</p>
            <p className="text-xs font-medium text-text-muted mt-1">Platform Commission (15%)</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border border-border shadow-sm rounded-2xl bg-surface justify-center">
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
             <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">$110</p>
            <p className="text-xs font-medium text-text-muted mt-1">Pending Payments</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border border-border shadow-sm rounded-2xl bg-surface justify-center">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">5</p>
            <p className="text-xs font-medium text-text-muted mt-1">Completed Transactions</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search by court manager or ID..." 
            className="pl-9 bg-surface border border-border h-11 w-full rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto relative">
          <Button 
            variant="outline" 
            className="h-11 px-4 bg-surface border border-border rounded-xl shrink-0 justify-between min-w-[140px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-text font-normal">All Status</span>
            <ChevronDown className="h-4 w-4 text-text-muted ml-2" />
          </Button>

          {isOpen && (
            <div className="absolute right-0 top-12 mt-1 w-48 bg-surface rounded-xl shadow-lg border border-border z-10 py-1 flex flex-col">
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-text" onClick={() => setIsOpen(false)}>All Status</button>
              <div className="h-px w-full bg-border" />
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-orange-500" onClick={() => setIsOpen(false)}>Pending</button>
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-blue-500" onClick={() => setIsOpen(false)}>Complete</button>
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-green-500" onClick={() => setIsOpen(false)}>Paid</button>
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-red-500" onClick={() => setIsOpen(false)}>Rejected</button>
            </div>
          )}
        </div>
      </div>

      <Card className="border border-border shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#fafafa] text-text font-semibold border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Payment ID</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Court Manager</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Courts</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Period</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Amount</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Request Date</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Status</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paymentsData.map((payment) => (
                <tr key={payment.id} className="bg-surface hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-[#00c853] font-medium text-xs whitespace-nowrap">{payment.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{payment.manager}</div>
                    <div className="text-text-muted mt-0.5 text-xs">{payment.email}</div>
                  </td>
                  <td className="px-6 py-4 text-text font-medium text-sm whitespace-nowrap">
                    {payment.courts}
                  </td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap text-sm">{payment.period}</td>
                  <td className="px-6 py-4 text-text font-bold whitespace-nowrap">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap text-sm">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <Link href={`/dashboard/payments/${payment.id}`}>
                        <Button size="sm" className="h-8 bg-[#00c853] hover:bg-[#00e676] text-white text-xs border-none shadow-sm rounded-full px-4">
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
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
