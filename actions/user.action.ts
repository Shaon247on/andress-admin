"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { usersQuerySchema } from "@/schemas/User.schema";
import type {
  UsersQuery,
  UsersListResponse,
  UserDetail,
} from "@/types/User.type";

// ── GET all users ─────────────────────────────────────────────────────────

export async function getUsersAction(rawParams: unknown): Promise<
  | { success: true; data: UsersListResponse }
  | { success: false; message: string }
> {
  const parseResult = usersQuerySchema.safeParse(rawParams);
  const params: UsersQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/users/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load users" };
    }
    
    return { success: true, data: result.data as UsersListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET user details ─────────────────────────────────────────────────────

export async function getUserDetailAction(id: string): Promise<
  | { success: true; data: UserDetail }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "User ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/users/${id}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load user details" };
    }
    
    return { success: true, data: result.data as UserDetail };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Suspend user ──────────────────────────────────────────────────────────

export async function suspendUserAction(id: string): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "User ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/users/${id}/suspend/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to suspend user" };
    }
    
    return { 
      success: true, 
      message: result.data?.message ?? "User suspended successfully." 
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Activate user ─────────────────────────────────────────────────────────

export async function activateUserAction(id: string): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "User ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/users/${id}/activate/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to activate user" };
    }
    
    return { 
      success: true, 
      message: result.data?.message ?? "User activated successfully." 
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Export users to CSV/Excel ────────────────────────────────────────────

export async function exportUsersAction(): Promise<
  | { success: true; data: string }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/users/export/", {
      responseType: 'text',
    });
    
    // The response is CSV text
    return { success: true, data: response.data };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}