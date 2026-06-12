"use client";

import React, { useState } from 'react';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Search, Filter, ChevronDown, Mail, X } from 'lucide-react';

const supportData = [
  { id: 'UT001', name: 'John Smith', email: 'john.smith@email.com', subject: 'Unable to book court', category: 'Booking Issue', status: 'Open', date: '2026-04-08' },
  { id: 'UT002', name: 'Emily Davis', email: 'emily.davis@email.com', subject: 'Refund request', category: 'Payment Issue', status: 'In Progress', date: '2026-04-07' },
  { id: 'UT003', name: 'Michael Brown', email: 'michael.brown@email.com', subject: 'App not loading', category: 'Technical Issue', status: 'Resolved', date: '2026-04-06' },
];

const StatusBadge = ({ status }: { status: string }) => {
  let colors = '';
  switch (status) {
    case 'Open':
      colors = 'bg-[#fef3c7] text-[#92400e]'; // Yellow
      break;
    case 'In Progress':
      colors = 'bg-blue-100 text-blue-800';
      break;
    case 'Resolved':
      colors = 'bg-green-100 text-green-800';
      break;
    default:
      colors = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
};

export default function SupportPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'managers'>('users');
  
  // Reply modal state
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (ticket: any) => {
    setSelectedTicket(ticket);
    setReplyText('');
  };

  const executeReply = () => {
    console.log(`Sending reply to ${selectedTicket?.id}: ${replyText}`);
    setSelectedTicket(null);
    setReplyText('');
    alert(`Reply sent to ${selectedTicket?.name} successfully.`);
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Support</h1>
        <p className="text-sm text-text-muted mt-1">Manage support tickets from users and court managers</p>
      </div>

       {/* Tabs */}
       <div className="flex items-center space-x-6 border-b border-border">
          <button 
            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'users' ? 'text-[#10b981]' : 'text-text-muted hover:text-text'}`}
            onClick={() => setActiveTab('users')}
          >
            AthlonGo Users
            {activeTab === 'users' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#10b981] rounded-t-full" />
            )}
          </button>
          
          <button 
            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'managers' ? 'text-[#10b981]' : 'text-text-muted hover:text-text'}`}
            onClick={() => setActiveTab('managers')}
          >
            Court Managers
            {activeTab === 'managers' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#10b981] rounded-t-full" />
            )}
          </button>
        </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center leading-none">
          <p className="text-3xl font-bold text-text">3</p>
          <p className="text-sm font-medium text-text-muted">Total Tickets</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center leading-none">
          <p className="text-3xl font-bold text-text">1</p>
          <p className="text-sm font-medium text-text-muted">Open</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center leading-none">
          <p className="text-3xl font-bold text-text">1</p>
          <p className="text-sm font-medium text-text-muted">In Progress</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center leading-none">
          <p className="text-3xl font-bold text-text">1</p>
          <p className="text-sm font-medium text-text-muted">Resolved</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search tickets..." 
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
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-text" onClick={() => setIsOpen(false)}>All Status</button>
              <div className="h-px w-full bg-border" />
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-blue-500" onClick={() => setIsOpen(false)}>Open</button>
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-red-500" onClick={() => setIsOpen(false)}>In Progress</button>
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-green-500" onClick={() => setIsOpen(false)}>Resolved</button>
            </div>
          )}
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text font-medium border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 w-[100px]">Ticket ID</th>
                <th scope="col" className="px-6 py-4">User</th>
                <th scope="col" className="px-6 py-4">Subject</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Created</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {supportData.map((ticket) => (
                <tr key={ticket.id} className="bg-surface hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-text font-medium text-xs whitespace-nowrap">{ticket.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{ticket.name}</div>
                    <div className="text-text-muted mt-0.5 text-xs">{ticket.email}</div>
                  </td>
                  <td className="px-6 py-4 text-text font-medium">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap">{ticket.category}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4 text-text-muted text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {ticket.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button size="sm" className="h-8 bg-[#10b981] hover:bg-[#059669] text-white text-xs border-none shadow-none font-medium px-4" onClick={() => handleReply(ticket)}>
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        Reply
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reply Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <Card className="w-full max-w-lg rounded-[24px] border-none shadow-2xl p-0 relative overflow-hidden bg-surface flex flex-col">
              
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface">
                <h3 className="text-lg font-bold text-text">Reply to Ticket {selectedTicket.id}</h3>
                 <button onClick={() => setSelectedTicket(null)} className="text-text-muted hover:text-text rounded-full p-1 hover:bg-background transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-text mb-2">Your Reply</p>
                <textarea 
                  className="w-full min-h-[150px] p-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-text-muted"
                  placeholder="Type your message here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-[0.4] border-border shadow-none bg-surface" onClick={() => setSelectedTicket(null)}>Cancel</Button>
                  <Button className="flex-1 bg-[#10b981] shadow-none hover:bg-[#059669]" onClick={executeReply}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
           </Card>
        </div>
      )}

    </div>
  );
}
