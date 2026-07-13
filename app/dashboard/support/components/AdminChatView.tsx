// app/dashboard/support/components/AdminChatView.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Send, Loader2, User, Mail, Calendar, Tag, 
  AlertCircle, CheckCircle, Clock, ArrowLeft, 
  MoreVertical, Check, Users, UserCog, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  adminReplyToTicketAction, 
  adminUpdateTicketStatusAction,
  getAdminTicketDetailsAction,
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

interface AdminChatViewProps {
  open: boolean;
  onClose: () => void;
  ticket: AdminSupportTicket | null;
  audience: 'users' | 'managers';
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

export default function AdminChatView({ open, onClose, ticket, audience }: AdminChatViewProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [thread, setThread] = useState<AdminThreadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<AdminSupportTicket | null>(ticket);
  const [isLocked, setIsLocked] = useState(ticket?.locked || false);
  const [isConnected, setIsConnected] = useState(false);

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
      if (currentTicket && data.ticket_code === currentTicket.code) {
        // Check if we already have this message
        const existingIds = new Set(thread.map(t => t.id));
        if (!existingIds.has(data.reply.id)) {
          setThread(prev => {
            const combined = [...prev, data.reply];
            const unique = deduplicateMessages(combined);
            return unique.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          });
          if (data.status) {
            setCurrentTicket(prev => prev ? { ...prev, status: data.status as any } : null);
          }
          scrollToBottom();
        }
      }
    },
    onStatus: (data) => {
      if (currentTicket && data.code === currentTicket.code) {
        setCurrentTicket(prev => prev ? { 
          ...prev, 
          status: data.status as any, 
          locked: data.locked 
        } : null);
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

  const loadThread = async () => {
    if (!currentTicket) {
      console.log('No current ticket to load');
      return;
    }
    
    console.log('Loading thread for ticket:', currentTicket.code);
    setLoading(true);
    
    try {
      console.log('Admin ticket details response:', currentTicket.code);
      const res = await getAdminTicketDetailsAction(currentTicket.code);
      console.log('Admin ticket details response:', res);
      
      if (res.success) {
        console.log('Thread data received:', {
          threadLength: res.data.thread?.length || 0,
          ticketStatus: res.data.ticket?.status,
          isLocked: res.data.ticket?.locked,
        });
        
        const uniqueThread = deduplicateMessages(res.data.thread || []);
        setThread(uniqueThread);
        setCurrentTicket(res.data.ticket);
        setIsLocked(res.data.ticket?.locked || res.data.ticket?.status === 'resolved');
        console.log('Thread loaded successfully, messages:', uniqueThread.length);
      } else {
        console.error('Failed to load thread:', res.message);
        toast.error(res.message);
      }
    } catch (error) {
      console.error('Error loading thread:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  useEffect(() => {
    if (open && ticket) {
      console.log('Opening chat for ticket:', ticket.code);
      setCurrentTicket(ticket);
      loadThread();
    } else {
      console.log('Chat closed or no ticket');
    }
  }, [open, ticket]);

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
    if (!replyMessage.trim() || !currentTicket) {
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
      // If the response has thread data, use it
      if (res.data?.thread) {
        const uniqueThread = deduplicateMessages(res.data.thread);
        setThread(uniqueThread);
      } else if (res.data?.ticket?.thread) {
        const uniqueThread = deduplicateMessages(res.data.ticket.thread);
        setThread(uniqueThread);
      }
      if (res.data?.ticket) {
        setCurrentTicket(res.data.ticket);
        setIsLocked(res.data.ticket.locked || res.data.ticket.status === 'resolved');
      }
      setReplyMessage('');
      toast.success('Reply sent');
      scrollToBottom();
    } else {
      toast.error(res.message);
    }
    setSending(false);
  };

  const handleStatusChange = async (status: 'open' | 'in_progress' | 'resolved') => {
    if (!currentTicket) return;

    if (status === 'resolved') {
      setResolveDialogOpen(true);
      return;
    }

    setResolving(true);
    const res = await adminUpdateTicketStatusAction(currentTicket.code, { status });
    if (res.success) {
      toast.success(res.data.message);
      setCurrentTicket(prev => prev ? { ...prev, status: status } : null);
      if (status === 'resolved') {
        setIsLocked(true);
      }
      // Refresh the thread to get updated data
      loadThread();
    } else {
      toast.error(res.message);
    }
    setResolving(false);
  };

  const handleResolve = async () => {
    if (!currentTicket) return;
    setResolving(true);
    const res = await adminUpdateTicketStatusAction(currentTicket.code, { status: 'resolved' });
    if (res.success) {
      toast.success(res.data.message);
      setCurrentTicket(prev => prev ? { ...prev, status: 'resolved', locked: true } : null);
      setIsLocked(true);
      setResolveDialogOpen(false);
      loadThread();
    } else {
      toast.error(res.message);
    }
    setResolving(false);
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
    } else {
      toast.error(res.message);
    }
    setEscalating(false);
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

  if (!open || !currentTicket) return null;

  const openingMessage = thread.find(msg => msg.is_opening);
  const otherMessages = thread.filter(msg => !msg.is_opening);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
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
                    className="text-blue-600"
                    onClick={() => {
                      if (currentTicket.status !== 'in_progress') {
                        handleStatusChange('in_progress');
                      }
                    }}
                    disabled={currentTicket.status === 'in_progress' || isLocked}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Mark In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-green-600"
                    onClick={() => handleStatusChange('resolved')}
                    disabled={isLocked}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve Ticket
                  </DropdownMenuItem>
                  {audience === 'users' && (
                    <DropdownMenuItem
                      className="text-purple-600"
                      onClick={() => setEscalateDialogOpen(true)}
                      disabled={isLocked}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Escalate to Manager
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="w-5 h-5 text-slate-500" />
              </Button>
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
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : otherMessages.length === 0 ? (
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
        </div>
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
    </>
  );
}