"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';

// Mock data strictly matching screenshot PAY-001 info
const paymentDetails: Record<string, any> = {
  'PAY-001': {
    id: 'PAY-001',
    status: 'Pending',
    managerName: 'City Sports Complex',
    courtsName: 'Courts 1-5',
    email: 'manager@citysports.com',
    phone: '+1 (555) 123-4567',
    withdrawalAmount: 2500,
    platformFee: 500,
    remainingBalance: 2000,
    paypalEmail: 'payments@citysports.com',
    bankAccount: '1458 2545 3648 1234',
    history: [
      { id: 1, action: 'Withdrawal request submitted', date: '2024-03-10 10:30 AM', user: 'System' },
      { id: 2, action: 'Request under review', date: '2024-03-10 11:00 AM', user: 'Admin' },
    ]
  }
};

export default function PaymentDetailsPage() {
  // Mock data for prototype
  const details = paymentDetails['PAY-001']; 

  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const executeAction = () => {
    console.log(`Executed ${modalType} on ${details.id}. Reason: ${rejectReason}`);
    setModalType(null);
    setRejectReason('');
    alert(`Payment ${modalType === 'approve' ? 'Approved' : 'Rejected'} successfully.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/payments">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-surface border-border">
              <ArrowLeft className="h-4 w-4 text-text" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text">Payment Request #{details.id}</h1>
            <p className="text-sm text-text-muted mt-0.5">Review and process withdrawal request</p>
          </div>
        </div>
        <span className="text-sm font-medium text-orange-500">{details.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Data) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Court Manager Info */}
          <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
            <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
               <span className="w-1 h-4 bg-gray-800 rounded-full inline-block" />
               Court Manager Information
            </h2>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-text-muted mb-1 font-medium">Manager Name</p>
                <p className="text-sm text-text font-medium">{details.managerName}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 font-medium">Courts Name</p>
                <p className="text-sm text-text font-medium">{details.courtsName}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 font-medium">Email</p>
                <p className="text-sm text-text font-medium">{details.email}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 font-medium">Phone</p>
                <p className="text-sm text-text font-medium">{details.phone}</p>
              </div>
            </div>
          </Card>

          {/* Financial Summary */}
          <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
            <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
               <span className="font-mono font-bold">$</span>
               Financial Summary - Feb 2024
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-[#f9fafb] rounded-xl border border-border/50">
                 <span className="text-sm font-medium text-text-muted">Withdrawal Amount</span>
                 <span className="text-sm font-bold text-text">${details.withdrawalAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-[#f9fafb] rounded-xl border border-border/50">
                 <span className="text-sm font-medium text-text-muted">Platform Fee (20%)</span>
                 <span className="text-sm font-bold text-red-500">- ${details.platformFee.toLocaleString()}</span>
              </div>

               <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                 <span className="text-sm font-bold text-green-700">Remaining Balance</span>
                 <span className="text-sm font-bold text-green-700">${details.remainingBalance.toLocaleString()}</span>
              </div>
            </div>
          </Card>

           {/* Payment Information */}
          <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
            <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
                <span className="w-4 h-3 border-2 border-text rounded-sm relative inline-block">
                  <span className="absolute top-0 right-0 w-1 h-1 bg-text" />
                </span>
               Payment Information
            </h2>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-2">
              <div>
                <p className="text-xs text-text-muted mb-1 font-medium">PayPal Email</p>
                <p className="text-sm text-text font-medium">{details.paypalEmail}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 font-medium">Bank Account</p>
                <p className="text-sm text-text font-medium">{details.bankAccount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (Actions & History) */}
        <div className="space-y-6">
           <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
             <h2 className="text-sm font-bold text-text mb-4">Actions</h2>
             <div className="flex flex-col gap-3">
               <Button 
                className="w-full bg-[#00c853] hover:bg-[#00e676] shadow-sm flex items-center justify-center gap-2 rounded-xl"
                onClick={() => setModalType('approve')}
               >
                 <CheckCircle2 className="w-4 h-4" />
                 Approve Request
               </Button>
               <Button 
                className="w-full bg-[#ef5350] hover:bg-[#f44336] shadow-sm flex items-center justify-center gap-2 rounded-xl text-white"
                onClick={() => setModalType('reject')}
               >
                 <XCircle className="w-4 h-4" />
                 Reject Request
               </Button>
             </div>
           </Card>

           <Card className="border border-border shadow-sm rounded-2xl bg-surface p-6">
             <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" />
               Activity History
             </h2>
             <div className="space-y-4 pl-2 border-l-2 border-[#e0e0e0] ml-2 relative">
               {details.history.map((item: any, idx: number) => (
                  <div key={item.id} className="relative pl-4">
                     {/* Timeline dot */}
                     <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-surface" />
                     <p className="text-xs font-semibold text-text">{item.action}</p>
                     <p className="text-[10px] text-text-muted mt-1 leading-tight">{item.date}</p>
                     <p className="text-[10px] text-text-muted leading-tight">By: {item.user}</p>
                  </div>
               ))}
             </div>
           </Card>
        </div>
      </div>

       {/* Overlays / Modals */}
       {modalType === 'approve' && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <Card className="w-full max-w-sm rounded-[24px] border-none shadow-2xl p-6 relative overflow-hidden bg-surface">
              <h3 className="text-lg font-bold text-text mb-2">Approve Withdrawal Request</h3>
              <p className="text-sm text-text-muted mb-6">
                Are you sure you want to approve this withdrawal request of ${details.withdrawalAmount.toLocaleString()} for {details.managerName}?
              </p>
              <div className="flex gap-3">
                <Button className="flex-1 bg-[#00c853] hover:bg-[#00e676] shadow-none rounded-xl" onClick={executeAction}>Yes, Approve</Button>
                <Button variant="outline" className="flex-1 border-border shadow-none rounded-xl bg-surface" onClick={() => setModalType(null)}>Cancel</Button>
              </div>
           </Card>
        </div>
       )}

       {modalType === 'reject' && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <Card className="w-full max-w-md rounded-[24px] border-none shadow-2xl p-6 relative overflow-hidden bg-surface">
              <h3 className="text-xl font-bold text-text mb-2">Reject Withdrawal Request</h3>
              <p className="text-sm text-text-muted mb-4">
                Please provide a reason for rejecting this request:
              </p>
              <textarea 
                  className="w-full min-h-[120px] p-4 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ef5350]/20 resize-none placeholder:text-text-muted mb-6"
                  placeholder="Enter rejection reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              <div className="flex gap-3">
                <Button className="flex-[1.5] bg-[#ef5350] hover:bg-[#f44336] shadow-none rounded-xl" onClick={executeAction}>Reject Request</Button>
                <Button variant="outline" className="flex-1 border-border shadow-none rounded-xl bg-surface" onClick={() => setModalType(null)}>Cancel</Button>
              </div>
           </Card>
        </div>
       )}
    </div>
  );
}
