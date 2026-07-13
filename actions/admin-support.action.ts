// actions/admin-support.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  adminSupportQuerySchema,
  adminReplySchema,
  adminStatusUpdateSchema,
  adminEscalateSchema,
} from "@/schemas/AdminSupport.schema";
import type {
  AdminSupportStats,
  AdminSupportQuery,
  AdminSupportTicketsResponse,
  AdminSupportTicketDetail,
  AdminReplyResponse,
  AdminStatusUpdateResponse,
  AdminEscalateResponse,
  AdminStatusUpdatePayload,
  AdminReplyPayload,
  AdminEscalatePayload,
} from "@/types/AdminSupport.type";

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getAdminSupportStatsAction(audience: 'users' | 'managers'): Promise<
  | { success: true; data: AdminSupportStats }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/support/stats/", { 
      params: { audience } 
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load stats" };
    }
    
    return { success: true, data: result.data as AdminSupportStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET tickets ────────────────────────────────────────────────────────────

export async function getAdminSupportTicketsAction(rawParams: unknown): Promise<
  | { success: true; data: AdminSupportTicketsResponse }
  | { success: false; message: string }
> {
  const parseResult = adminSupportQuerySchema.safeParse(rawParams);
  if (!parseResult.success) {
    return { success: false, message: "Invalid parameters" };
  }
  
  const params: AdminSupportQuery = parseResult.data;

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/support/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load tickets" };
    }
    
    return { success: true, data: result.data as AdminSupportTicketsResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET ticket details ────────────────────────────────────────────────────

export async function getAdminTicketDetailsAction(code: string): Promise<
  | { success: true; data: AdminSupportTicketDetail }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Ticket code is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/support/${code}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load ticket details" };
    }
    
    // The response has ticket with thread inside it
    // We need to extract ticket and thread properly
    const data = result.data;
    
    // Log the response structure for debugging
    console.log('Admin ticket details response:', {
      hasTicket: !!data.ticket,
      hasThread: !!(data.ticket?.thread),
      threadLength: data.ticket?.thread?.length || 0,
    });
    
    return { 
      success: true, 
      data: {
        ticket: data.ticket,
        thread: data.ticket?.thread || []
      }
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Reply to ticket ────────────────────────────────────────────────────────

export async function adminReplyToTicketAction(
  code: string,
  raw: unknown
): Promise<
  | { success: true; data: AdminReplyResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Ticket code is required" };

  const parsed = adminReplySchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.errors[0]?.message ?? "Invalid input" 
    };
  }

  const body: AdminReplyPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/support/${code}/reply/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to send reply" };
    }
    
    // Extract thread from response if available
    const data = result.data;
    if (data?.ticket?.thread) {
      data.thread = data.ticket.thread;
    }
    
    return { success: true, data: data as AdminReplyResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Update ticket status ──────────────────────────────────────────────────

export async function adminUpdateTicketStatusAction(
  code: string,
  raw: unknown
): Promise<
  | { success: true; data: AdminStatusUpdateResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Ticket code is required" };

  const parsed = adminStatusUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.errors[0]?.message ?? "Invalid input" 
    };
  }

  const body: AdminStatusUpdatePayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.patch(`/admin/support/${code}/status/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to update status" };
    }
    
    return { success: true, data: result.data as AdminStatusUpdateResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Escalate to manager ──────────────────────────────────────────────────

export async function adminEscalateToManagerAction(
  managerId: string,
  raw: unknown
): Promise<
  | { success: true; data: AdminEscalateResponse }
  | { success: false; message: string }
> {
  if (!managerId) return { success: false, message: "Manager ID is required" };

  const parsed = adminEscalateSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.errors[0]?.message ?? "Invalid input" 
    };
  }

  const body: AdminEscalatePayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/support/manager/${managerId}/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to escalate ticket" };
    }
    
    return { success: true, data: result.data as AdminEscalateResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}