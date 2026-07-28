// types/AdminSupport.type.ts

export interface SupportCategory {
  value: string;
  label: string;
}

export interface SupportStatus {
  value: string;
  label: string;
}

export interface AdminSupportUser {
  id: string;
  full_name: string;
  email: string;
  role?: string;
}

export interface AdminSupportTicket {
  id: string;
  code: string;
  user: AdminSupportUser;
  subject: string;
  category: string;
  category_display: string;
  status: 'open' | 'in_progress' | 'resolved';
  locked: boolean;
  created_at: string;
  updated_at: string;
  reply_count: number;
  unread_count: number; // Added this field
}

export interface AdminSupportTicketDetail {
  ticket: AdminSupportTicket;
  thread: AdminThreadItem[];
}

export interface AdminThreadSender {
  id: string;
  name: string;
  role: string;
  is_staff: boolean;
}

export interface AdminThreadItem {
  id: string;
  message: string;
  created_at: string;
  is_opening: boolean;
  sender: AdminThreadSender;
}

export interface AdminSupportTicketsResponse {
  success: boolean;
  results: AdminSupportTicket[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface AdminSupportStats {
  success: boolean;
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
}

export interface AdminSupportQuery {
  audience: 'users' | 'managers';
  search?: string;
  status?: 'open' | 'in_progress' | 'resolved';
  page?: number;
}

export interface AdminReplyPayload {
  message: string;
}

export interface AdminReplyResponse {
  success: boolean;
  message: string;
  status: string;
  ticket?: AdminSupportTicket;
  thread?: AdminThreadItem[];
}

export interface AdminStatusUpdatePayload {
  status: 'open' | 'in_progress' | 'resolved';
}

export interface AdminStatusUpdateResponse {
  success: boolean;
  message: string;
  status: string;
}

export interface AdminEscalatePayload {
  subject: string;
  message: string;
  category: string;
}

export interface AdminEscalateResponse {
  success: boolean;
  message: string;
  ticket: {
    code: string;
    subject: string;
    status: string;
    locked: boolean;
    reply_count: number;
  };
}

// ── Socket Event Types ──

export interface SocketReplyEvent {
  ticket_code: string;
  reply: AdminThreadItem;
  status: string;
}

export interface SocketStatusEvent {
  code: string;
  status: string;
  locked: boolean;
}

export interface SocketTicketEvent {
  code: string;
  subject: string;
  category: string;
  status: string;
  created_at: string;
  opened_by_staff: boolean;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export interface SocketBadgeEvent {
  users: {
    unread: number;
  };
  managers: {
    unread: number;
  };
  total_unread: number;
}

export interface SupportBadgeData {
  users: { unread: number };
  managers: { unread: number };
  total_unread: number;
}