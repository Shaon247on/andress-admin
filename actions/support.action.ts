// actions/support.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { supportQuerySchema, replySchema, statusUpdateSchema } from "@/schemas/Support.schema";
import type {
  SupportStats,
  SupportQuery,
  SupportTicketsResponse,
  TicketDetailResponse,
  ReplyPayload,
  ReplyResponse,
  StatusUpdatePayload,
  StatusUpdateResponse,
} from "@/types/Support.type";

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getSupportStatsAction(audience: 'users' | 'managers'): Promise<
  | { success: true; data: SupportStats }
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
    
    return { success: true, data: result.data as SupportStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET tickets ────────────────────────────────────────────────────────────

export async function getSupportTicketsAction(rawParams: unknown): Promise<
  | { success: true; data: SupportTicketsResponse }
  | { success: false; message: string }
> {
  const parseResult = supportQuerySchema.safeParse(rawParams);
  if (!parseResult.success) {
    return { success: false, message: "Invalid parameters" };
  }
  
  const params: SupportQuery = parseResult.data;

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/support/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load tickets" };
    }
    
    return { success: true, data: result.data as SupportTicketsResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET ticket details ────────────────────────────────────────────────────

export async function getTicketDetailsAction(code: string): Promise<
  | { success: true; data: TicketDetailResponse }
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
    
    return { success: true, data: result.data as TicketDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Reply to ticket ───────────────────────────────────────────────────────

export async function replyToTicketAction(
  code: string,
  raw: unknown
): Promise<
  | { success: true; data: ReplyResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Ticket code is required" };

  const parsed = replySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const body: ReplyPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/support/${code}/reply/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to send reply" };
    }
    
    return { success: true, data: result.data as ReplyResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Update ticket status ─────────────────────────────────────────────────

export async function updateTicketStatusAction(
  code: string,
  raw: unknown
): Promise<
  | { success: true; data: StatusUpdateResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Ticket code is required" };

  const parsed = statusUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const body: StatusUpdatePayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/support/${code}/status/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to update status" };
    }
    
    return { success: true, data: result.data as StatusUpdateResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}