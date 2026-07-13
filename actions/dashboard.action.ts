"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import type { DashboardData } from "@/types/Dashboard.type";

// ── GET dashboard data ──────────────────────────────────────────────────────

export async function getDashboardAction(): Promise<
  | { success: true; data: DashboardData }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/dashboard/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load dashboard data" };
    }
    
    return { success: true, data: result.data as DashboardData };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}