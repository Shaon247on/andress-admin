// actions/payment.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { paymentsQuerySchema, rejectPaymentSchema } from "@/schemas/Payment.schema";
import type {
  PaymentStats,
  PaymentsQuery,
  PaymentsListResponse,
  PaymentDetailResponse,
  ApprovePaymentResponse,
  RejectPaymentPayload,
  RejectPaymentResponse,
} from "@/types/Payment.type";

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getPaymentStatsAction(): Promise<
  | { success: true; data: PaymentStats }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/admin/payments/stats/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load stats" };
    }
    
    return { success: true, data: result.data as PaymentStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET payments ───────────────────────────────────────────────────────────

export async function getPaymentsAction(rawParams: unknown): Promise<
  | { success: true; data: PaymentsListResponse }
  | { success: false; message: string }
> {
  const parseResult = paymentsQuerySchema.safeParse(rawParams);
  const params: PaymentsQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/admin/payments/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load payments" };
    }
    
    return { success: true, data: result.data as PaymentsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET payment details ───────────────────────────────────────────────────

export async function getPaymentDetailsAction(code: string): Promise<
  | { success: true; data: PaymentDetailResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Payment code is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/admin/payments/${code}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load payment details" };
    }
    
    return { success: true, data: result.data as PaymentDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Approve payment ────────────────────────────────────────────────────────

export async function approvePaymentAction(code: string): Promise<
  | { success: true; data: ApprovePaymentResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Payment code is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/payments/${code}/approve/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to approve payment" };
    }
    
    return { success: true, data: result.data as ApprovePaymentResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Reject payment ─────────────────────────────────────────────────────────

export async function rejectPaymentAction(
  code: string,
  raw: unknown
): Promise<
  | { success: true; data: RejectPaymentResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Payment code is required" };

  const parsed = rejectPaymentSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const body: RejectPaymentPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post(`/admin/payments/${code}/reject/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to reject payment" };
    }
    
    return { success: true, data: result.data as RejectPaymentResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}