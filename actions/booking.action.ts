"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { bookingsQuerySchema } from "@/schemas/Booking.schema";
import type {
  BookingStats,
  BookingsQuery,
  BookingsListResponse,
  BookingDetail,
} from "@/types/Booking.type";

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getBookingStatsAction(): Promise<
  { success: true; data: BookingStats } | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/bookings/stats/");
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load stats",
      };
    }

    return { success: true, data: result.data as BookingStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET all bookings ───────────────────────────────────────────────────────

export async function getBookingsAction(
  rawParams: unknown,
): Promise<
  | { success: true; data: BookingsListResponse }
  | { success: false; message: string }
> {
  const parseResult = bookingsQuerySchema.safeParse(rawParams);
  const params: BookingsQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/bookings/", { params });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load bookings",
      };
    }

    return { success: true, data: result.data as BookingsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

export async function getBookingDetailsAction(
  id: string,
): Promise<
  { success: true; data: BookingDetail } | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Booking ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/bookings/${id}/`);
    const result = handleActionResponse(response.data);
    console.log("the bookings from server:", result);
    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load booking details",
      };
    }

    return { success: true, data: result.data.booking as BookingDetail };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
