// actions/admin-user.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  adminUsersQuerySchema,
  createAdminUserSchema,
  editAdminUserSchema,
} from "@/schemas/AdminUser.schema";
import type {
  AdminUsersQuery,
  AdminUsersListResponse,
  AdminUserResult,
  CreateAdminUserPayload,
  EditAdminUserPayload,
} from "@/types/AdminUser.type";

// ── GET all admin users ─────────────────────────────────────────────────────

export async function getAdminUsersAction(rawParams: unknown): Promise<
  | { success: true; data: AdminUsersListResponse }
  | { success: false; message: string }
> {
  const parseResult = adminUsersQuerySchema.safeParse(rawParams);
  const params: AdminUsersQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/admin-users/", { params });
    const result = handleActionResponse(response.data);
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load admin users" };
    }
    return { success: true, data: result.data as AdminUsersListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── CREATE admin user ───────────────────────────────────────────────────────

export async function createAdminUserAction(raw: unknown): Promise<
  | { success: true; message: string; user_id: string }
  | { success: false; message: string }
> {
  const parsed = createAdminUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const body: CreateAdminUserPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/admin/admin-users/create/", body);
    const result = handleActionResponse(response.data);
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to create admin user" };
    }
    return {
      success: true,
      message: result.data?.message ?? "Admin account created successfully.",
      user_id: result.data?.user_id as string,
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── EDIT admin user ─────────────────────────────────────────────────────────

export async function editAdminUserAction(id: string, raw: unknown): Promise<
  | { success: true; message: string; user_id: string }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "User ID is required" };

  const parsed = editAdminUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const body: EditAdminUserPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.patch(`/admin/admin-users/${id}/edit/`, body);
    const result = handleActionResponse(response.data);
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to update admin user" };
    }
    return {
      success: true,
      message: result.data?.message ?? "Admin user updated successfully.",
      user_id: result.data?.user_id as string,
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}