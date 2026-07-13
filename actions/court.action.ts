"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { courtsQuerySchema } from "@/schemas/Court.schema";
import type {
  CourtStats,
  CourtsQuery,
  CourtsListResponse,
} from "@/types/Court.type";

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getCourtStatsAction(): Promise<
  | { success: true; data: CourtStats }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/courts/stats/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load stats" };
    }
    
    return { success: true, data: result.data as CourtStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET all courts ─────────────────────────────────────────────────────────

export async function getCourtsAction(rawParams: unknown): Promise<
  | { success: true; data: CourtsListResponse }
  | { success: false; message: string }
> {
  const parseResult = courtsQuerySchema.safeParse(rawParams);
  const params: CourtsQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/courts/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load courts" };
    }
    
    return { success: true, data: result.data as CourtsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}