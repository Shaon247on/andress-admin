// app/dashboard/support/[id]/AdminChatPage.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Send, Loader2, User, Mail, Calendar, Tag, 
  CheckCircle, Clock, MoreVertical, Users, MessageSquare, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  adminReplyToTicketAction, 
  adminUpdateTicketStatusAction,
  adminEscalateToManagerAction
} from '@/actions/admin-support.action';
import { useAdminSupportSocket } from '@/hooks/useAdminSupportSocket';
import type { AdminSupportTicket, AdminThreadItem } from '@/types/AdminSupport.type';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AdminChatPageProps {
  ticket: AdminSupportTicket;
  thread: AdminThreadItem[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    open: { label: 'Open', className: 'bg-red-100 text-red-700' },
    in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
    resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' },
  };
  const { label, className } = statusMap[status] || statusMap.open;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

export default function AdminChatPage({ ticket: initialTicket, thread: initialThread }: AdminChatPageProps) {
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [thread, setThread] = useState<AdminThreadItem[]>(initialThread || []);
  const [currentTicket, setCurrentTicket] = useState<AdminSupportTicket>(initialTicket);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isLocked, setIsLocked] = useState(initialTicket.locked || initialTicket.status === 'resolved');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Escalate dialog states
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [escalateSubject, setEscalateSubject] = useState('');
  const [escalateMessage, setEscalateMessage] = useState('');
  const [escalateCategory, setEscalateCategory] = useState('other');
  const [escalating, setEscalating] = useState(false);
  const [managerId, setManagerId] = useState('');

  // Resolve dialog states
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolving, setResolving] = useState(false);

  // Determine audience from ticket code
  const audience = currentTicket.code.startsWith('UT') ? 'users' : 'managers';

  // Deduplicate messages
  const deduplicateMessages = useCallback((messages: AdminThreadItem[]): AdminThreadItem[] => {
    const seen = new Set<string>();
    return messages.filter(msg => {
      if (seen.has(msg.id)) {
        return false;
      }
      seen.add(msg.id);
      return true;
    });
  }, []);

  // Socket for real-time updates
  const { isConnected: socketConnected } = useAdminSupportSocket({
    onReply: (data) => {
      if (data.ticket_code === currentTicket.code) {
        const existingIds = new Set(thread.map(t => t.id));
        if (!existingIds.has(data.reply.id)) {
          setThread(prev => {
            const combined = [...prev, data.reply];
            const unique = deduplicateMessages(combined);
            return unique.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          });
          if (data.status) {
            setCurrentTicket(prev => ({ ...prev, status: data.status as any }));
          }
          scrollToBottom();
        }
      }
    },
    onStatus: (data) => {
      if (data.code === currentTicket.code) {
        setCurrentTicket(prev => ({ 
          ...prev, 
          status: data.status as any, 
          locked: data.locked 
        }));
        setIsLocked(data.locked);
        if (data.locked) {
          toast.info('This ticket has been resolved and is now locked.');
        }
      }
    },
  });

  useEffect(() => {
    setIsConnected(socketConnected);
  }, [socketConnected]);

  useEffect(() => {
    if (thread.length > 0) {
      scrollToBottom();
    }
  }, [thread]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (isLocked) {
      toast.error('This ticket is resolved and cannot be replied to');
      return;
    }

    setSending(true);
    const res = await adminReplyToTicketAction(currentTicket.code, { message: replyMessage });
    if (res.success) {
      if (res.data?.thread) {
        const uniqueThread = deduplicateMessages(res.data.thread);
        setThread(uniqueThread);
      }
      if (res.data?.ticket) {
        setCurrentTicket(res.data.ticket);
        setIsLocked(res.data.ticket.locked || res.data.ticket.status === 'resolved');
      }
      setReplyMessage('');
      scrollToBottom();
    } else {
      toast.error(res.message);
    }
    setSending(false);
  };

  const handleStatusChange = async (status: 'open' | 'in_progress' | 'resolved') => {
    if (status === 'resolved') {
      setResolveDialogOpen(true);
      return;
    }

    setResolving(true);
    const res = await adminUpdateTicketStatusAction(currentTicket.code, { status });
    if (res.success) {
      toast.success(res.data.message);
      setCurrentTicket(prev => ({ ...prev, status }));
      setResolving(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setResolving(false);
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    const res = await adminUpdateTicketStatusAction(currentTicket.code, { status: 'resolved' });
    if (res.success) {
      toast.success(res.data.message);
      setCurrentTicket(prev => ({ ...prev, status: 'resolved', locked: true }));
      setIsLocked(true);
      setResolveDialogOpen(false);
      setResolving(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setResolving(false);
    }
  };

  const handleEscalate = async () => {
    if (!escalateSubject.trim() || !escalateMessage.trim() || !managerId) {
      toast.error('All fields are required');
      return;
    }

    setEscalating(true);
    const res = await adminEscalateToManagerAction(managerId, {
      subject: escalateSubject,
      message: escalateMessage,
      category: escalateCategory,
    });
    if (res.success) {
      toast.success(res.data.message);
      setEscalateDialogOpen(false);
      setEscalateSubject('');
      setEscalateMessage('');
      setEscalateCategory('other');
      setManagerId('');
      setEscalating(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setEscalating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const openingMessage = thread.find(msg => msg.is_opening);
  const otherMessages = thread.filter(msg => !msg.is_opening);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/support"
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {getInitials(currentTicket.user.full_name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 truncate">{currentTicket.user.full_name}</h3>
                <StatusBadge status={currentTicket.status} />
                {isConnected && (
                  <span className="inline-flex items-center text-xs text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    Live
                  </span>
                )}
                {isLocked && (
                  <span className="inline-flex items-center text-xs text-red-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                    Locked
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {currentTicket.code} • {currentTicket.category_display}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="text-green-600"
                onClick={() => handleStatusChange('resolved')}
                disabled={isLocked}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Ticket Info Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{currentTicket.user.full_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate max-w-[150px]">{currentTicket.user.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(currentTicket.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{currentTicket.category_display}</span>
          </div>
        </div>
      </div>

      {/* Initial Request Block */}
      {openingMessage && (
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              {getInitials(openingMessage.sender.name)}
            </div>
            <span className="font-semibold text-slate-700 text-sm">{openingMessage.sender.name}</span>
            <span className="text-xs text-slate-400">{formatDate(openingMessage.created_at)}</span>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{openingMessage.message}</p>
        </div>
      )}

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {otherMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No replies yet</p>
              <p className="text-sm">Start the conversation</p>
            </div>
          </div>
        ) : (
          otherMessages.map((msg) => {
            const isStaff = msg.sender.is_staff;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-center gap-2 mb-1 ${isStaff ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                    isStaff ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}>
                    {getInitials(msg.sender.name)}
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">
                    {msg.sender.name}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
                <div className={`max-w-[85%] ${isStaff ? 'mr-9' : 'ml-9'}`}>
                  <div className={`rounded-2xl p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    isStaff
                      ? 'bg-emerald-500 text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 rounded-tl-sm'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Box */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        {isLocked ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-slate-500">
            <p className="font-medium">This ticket is resolved and locked</p>
            <p className="text-sm">No further replies can be added.</p>
          </div>
        ) : (
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                placeholder="Type your reply..."
                className="w-full min-h-[60px] max-h-[120px] p-3 resize-none bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply();
                  }
                }}
                disabled={sending}
              />
            </div>
            <Button
              variant="primary"
              className="h-[60px] px-4 rounded-xl shrink-0"
              onClick={handleReply}
              disabled={sending || !replyMessage.trim()}
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to resolve this ticket? This will lock the thread and prevent further replies.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)} disabled={resolving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResolve} disabled={resolving}>
              {resolving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Escalate Dialog */}
      <Dialog open={escalateDialogOpen} onOpenChange={setEscalateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escalate to Manager</DialogTitle>
            <DialogDescription>
              Create a new ticket for a court manager to investigate this issue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Manager ID</label>
              <Input
                placeholder="Enter the manager's user ID"
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <Input
                placeholder="Brief description"
                value={escalateSubject}
                onChange={(e) => setEscalateSubject(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Message</label>
              <textarea
                placeholder="Details for the manager..."
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px] resize-none mt-1"
                value={escalateMessage}
                onChange={(e) => setEscalateMessage(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Category</label>
              <Select value={escalateCategory} onValueChange={setEscalateCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking">Booking Issue</SelectItem>
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscalateDialogOpen(false)} disabled={escalating}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEscalate} disabled={escalating}>
              {escalating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Escalate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}