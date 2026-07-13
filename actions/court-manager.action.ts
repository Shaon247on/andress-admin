// actions/court-manager.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  courtManagersQuerySchema,
  commissionUpdateSchema,
} from "@/schemas/CourtManager.schema";
import type {
  CourtManagerStats,
  CourtManagersQuery,
  CourtManagersListResponse,
  CourtManagerDetailResponse,
  CourtsTabResponse,
  BookingsTabResponse,
  CustomersTabResponse,
  TeamTabResponse,
  PostsTabResponse,
  CommissionResponse,
  CommissionUpdateResponse,
  CommissionUpdatePayload,
} from "@/types/CourtManager.type";
import { revalidatePath } from "next/cache";

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getCourtManagerStatsAction(): Promise<
  | { success: true; data: CourtManagerStats }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/court-managers/stats/");
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load stats",
      };
    }

    return { success: true, data: result.data as CourtManagerStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET all court managers ────────────────────────────────────────────────

export async function getCourtManagersAction(
  rawParams: unknown,
): Promise<
  | { success: true; data: CourtManagersListResponse }
  | { success: false; message: string }
> {
  const parseResult = courtManagersQuerySchema.safeParse(rawParams);
  const params: CourtManagersQuery = parseResult.success
    ? parseResult.data
    : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/court-managers/", { params });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load court managers",
      };
    }

    return { success: true, data: result.data as CourtManagersListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET court manager details ─────────────────────────────────────────────

export async function getCourtManagerDetailAction(
  id: string,
): Promise<
  | { success: true; data: CourtManagerDetailResponse }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/court-managers/${id}/`);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load manager details",
      };
    }

    return { success: true, data: result.data as CourtManagerDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// actions/court-manager.action.ts - Add page parameter to tab actions

// ── GET courts tab data ───────────────────────────────────────────────────

export async function getCourtsTabAction(
  id: string,
  page: number = 1,
): Promise<
  | { success: true; data: CourtsTabResponse }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/court-managers/${id}/courts/`, {
      params: { page },
    });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load courts data",
      };
    }

    return { success: true, data: result.data as CourtsTabResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET bookings tab data ─────────────────────────────────────────────────

export async function getBookingsTabAction(
  id: string,
  page: number = 1,
): Promise<
  | { success: true; data: BookingsTabResponse }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/court-managers/${id}/bookings/`, {
      params: { page },
    });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load bookings data",
      };
    }

    return { success: true, data: result.data as BookingsTabResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET customers tab data ────────────────────────────────────────────────

export async function getCustomersTabAction(
  id: string,
  page: number = 1,
): Promise<
  | { success: true; data: CustomersTabResponse }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/court-managers/${id}/customers/`, {
      params: { page },
    });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load customers data",
      };
    }

    return { success: true, data: result.data as CustomersTabResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET team tab data ─────────────────────────────────────────────────────

export async function getTeamTabAction(
  id: string,
  page: number = 1,
): Promise<
  { success: true; data: TeamTabResponse } | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/court-managers/${id}/team/`, {
      params: { page },
    });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load team data",
      };
    }

    return { success: true, data: result.data as TeamTabResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET posts tab data ────────────────────────────────────────────────────

export async function getPostsTabAction(
  id: string,
  page: number = 1,
): Promise<
  | { success: true; data: PostsTabResponse }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/court-managers/${id}/posts/`, {
      params: { page },
    });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load posts data",
      };
    }

    return { success: true, data: result.data as PostsTabResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET commission ────────────────────────────────────────────────────────

export async function getCommissionAction(
  id: string,
): Promise<
  | { success: true; data: CommissionResponse }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/court-managers/${id}/commission/`);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load commission data",
      };
    }

    return { success: true, data: result.data as CommissionResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── UPDATE commission ─────────────────────────────────────────────────────

export async function updateCommissionAction(
  id: string,
  raw: unknown,
): Promise<
  | { success: true; data: CommissionUpdateResponse }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  const parsed = commissionUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  const body: CommissionUpdatePayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.put(
      `/admin/court-managers/${id}/commission/`,
      body,
    );
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to update commission",
      };
    }

    return { success: true, data: result.data as CommissionUpdateResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Suspend manager ──────────────────────────────────────────────────────

export async function suspendManagerAction(
  id: string,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/court-managers/${id}/suspend/`);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to suspend manager",
      };
    }
    revalidatePath("/dashboard/court-managers");
    return {
      success: true,
      message: result.data?.message ?? "Manager suspended successfully.",
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Activate manager ──────────────────────────────────────────────────────

export async function activateManagerAction(
  id: string,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Manager ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/court-managers/${id}/activate/`);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to activate manager",
      };
    }
    revalidatePath("/dashboard/court-managers");

    return {
      success: true,
      message: result.data?.message ?? "Manager activated successfully.",
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Suspend post ────────────────────────────────────────────────────────

export async function suspendPostAction(
  postId: string,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  if (!postId) return { success: false, message: "Post ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/manager-posts/${postId}/suspend/`);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to suspend post",
      };
    }

    return {
      success: true,
      message: result.data?.message ?? "Post suspended successfully.",
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Unsuspend post ────────────────────────────────────────────────────────

export async function unsuspendPostAction(
  postId: string,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  if (!postId) return { success: false, message: "Post ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(
      `/admin/manager-posts/${postId}/unsuspend/`,
    );
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to unsuspend post",
      };
    }

    return {
      success: true,
      message: result.data?.message ?? "Post restored successfully.",
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
