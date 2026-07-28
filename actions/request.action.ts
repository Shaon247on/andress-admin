"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { requestsQuerySchema } from "@/schemas/Request.schema";
import type {
  RequestStats,
  RequestsQuery,
  RequestsListResponse,
  RequestDetail,
} from "@/types/Request.type";
import { revalidatePath } from "next/cache";

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getRequestStatsAction(): Promise<
  { success: true; data: RequestStats } | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/applications/stats/");
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load stats",
      };
    }

    return { success: true, data: result.data as RequestStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET all requests ─────────────────────────────────────────────────────

export async function getRequestsAction(
  rawParams: unknown,
): Promise<
  | { success: true; data: RequestsListResponse }
  | { success: false; message: string }
> {
  const parseResult = requestsQuerySchema.safeParse(rawParams);
  const params: RequestsQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/applications/", { params });
    const result = handleActionResponse(response.data);

    console.log("The resquests:", result);
    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load requests",
      };
    }

    return { success: true, data: result.data as RequestsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET request details ─────────────────────────────────────────────────

export async function getRequestDetailAction(
  id: string,
): Promise<
  { success: true; data: RequestDetail } | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Request ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/applications/${id}/`);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load request details",
      };
    }

    return { success: true, data: result.data as RequestDetail };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Approve request ──────────────────────────────────────────────────────

export async function approveRequestAction(
  id: string,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Request ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/applications/${id}/approve/`);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to approve request",
      };
    }

    revalidatePath("/dashboard/requests");

    return {
      success: true,
      message: result.data?.message ?? "Application approved successfully.",
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Decline request ──────────────────────────────────────────────────────

export async function declineRequestAction(
  id: string,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Request ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/applications/${id}/decline/`);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to decline request",
      };
    }
    revalidatePath("/dashboard/requests");

    return {
      success: true,
      message: result.data?.message ?? "Application declined successfully.",
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
