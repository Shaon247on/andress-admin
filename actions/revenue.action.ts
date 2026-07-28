"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import type {
  RevenueStats,
  RevenueHistoryResponse,
  WithdrawPayload,
  WithdrawResponse,
} from "@/types/Revenue.type";

// ── GET Revenue Stats ──────────────────────────────────────────────────────

export async function getRevenueStatsAction(): Promise<
  | { success: true; data: RevenueStats }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/revenue/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { 
        success: false, 
        message: result.message ?? "Failed to load revenue stats" 
      };
    }
    
    return { success: true, data: result.data as RevenueStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET Revenue History ────────────────────────────────────────────────────

export async function getRevenueHistoryAction(
  rawParams: unknown
): Promise<
  | { success: true; data: RevenueHistoryResponse }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/revenue/history/", { 
      params: rawParams 
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { 
        success: false, 
        message: result.message ?? "Failed to load revenue history" 
      };
    }
    
    return { success: true, data: result.data as RevenueHistoryResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Withdraw ───────────────────────────────────────────────────────────────

export async function withdrawAction(
  raw: unknown
): Promise<
  | { success: true; data: WithdrawResponse }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.post("/admin/revenue/withdraw/", raw);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { 
        success: false, 
        message: result.message ?? "Failed to process withdrawal" 
      };
    }
    
    return { success: true, data: result.data as WithdrawResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}