// actions/settings.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { updateSession } from "@/lib/cookies";
import {
  profileUpdateSchema,
  changePasswordSchema,
} from "@/schemas/Settings.schema";
import type {
  ProfileResponse,
  ProfileUpdatePayload,
  ProfileUpdateResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/types/Settings.type";

// ── GET profile ────────────────────────────────────────────────────────────

export async function getProfileAction(): Promise<
  { success: true; data: ProfileResponse } | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/settings/profile/");
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load profile",
      };
    }

    return { success: true, data: result.data as ProfileResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── UPDATE profile ─────────────────────────────────────────────────────────

export async function updateProfileAction(
  raw: FormData,
): Promise<
  | { success: true; data: ProfileUpdateResponse }
  | { success: false; message: string }
> {
  try {
    // Extract and validate text fields
    const full_name = (raw.get("full_name") as string) || undefined;
    const email = (raw.get("email") as string) || undefined;
    const phone_number = (raw.get("phone_number") as string) || undefined;
    const avatar = (raw.get("avatar") as File) || undefined;

    // Validate the data
    const validationResult = profileUpdateSchema.safeParse({
      full_name,
      email,
      phone_number,
    });
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors[0]?.message ?? "Invalid input",
      };
    }

    // Create FormData for the API
    const formData = new FormData();
    if (full_name) formData.append("full_name", full_name);
    if (email) formData.append("email", email);
    if (phone_number) formData.append("phone_number", phone_number);
    if (avatar && avatar instanceof File) {
      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      if (avatar.size > 2 * 1024 * 1024) {
        return {
          success: false,
          message: "Avatar image must be less than 2MB",
        };
      }
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(avatar.type)) {
        return {
          success: false,
          message: "Avatar must be JPG, PNG, or GIF format",
        };
      }
      formData.append("avatar", avatar);
    }

    const api = await getServerApi();
    const response = await api.patch("/admin/settings/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to update profile",
      };
    }

    const profileData = result.data as ProfileUpdateResponse;

    // ── Update session cookie with new user data ──
    const updatedUserData = {
      full_name: profileData.profile.full_name,
      email: profileData.profile.email,
      phone_number: profileData.profile.phone_number,
      avatar_url: profileData.profile.avatar_url,
      role: profileData.profile.role,
    };
    await updateSession(updatedUserData);

    return { success: true, data: profileData };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Change password ────────────────────────────────────────────────────────

export async function changePasswordAction(
  raw: unknown,
): Promise<
  | { success: true; data: ChangePasswordResponse }
  | { success: false; message: string }
> {
  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  const body: ChangePasswordPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/admin/settings/change-password/", body);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to change password",
      };
    }

    return { success: true, data: result.data as ChangePasswordResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}