"use server";

import { getServerApi } from '@/lib/server-api';
import { setAuthCookies, setSessionToken, setResetToken, getResetToken, getSessionToken, clearAuthCookies } from '@/lib/cookies';
import { handleApiError, handleActionResponse } from '@/lib/errors';
import { loginSchema, forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema } from '@/schemas/auth.schema';

export async function loginAction(values: unknown) {
  const parseResult = loginSchema.safeParse(values);
  if (!parseResult.success) {
    return { success: false, message: parseResult.error.errors[0]?.message || 'Invalid login values' };
  }

  try {
    const api = await getServerApi();
    const response = await api.post('/admin/auth/login/', parseResult.data);
    const apiResult = handleActionResponse(response.data);
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || 'Login failed' };
    }

    const data = apiResult.data;
    // Store permissions along with the rest of the data
    await setAuthCookies({ 
      access_token: data.access_token, 
      refresh_token: data.refresh_token, 
      user: data.user,
      permissions: data.user?.permissions || {}
    });
    return { success: true, data: { user: data.user } };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}


export async function forgotPasswordAction(values: unknown) {
  const parseResult = forgotPasswordSchema.safeParse(values);
  if (!parseResult.success) {
    return { success: false, message: parseResult.error.errors[0]?.message || 'Invalid email address' };
  }

  try {
    const api = await getServerApi();
    const response = await api.post('/admin/auth/forgot-password/', parseResult.data);
    const apiResult = handleActionResponse(response.data);
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || 'Request failed' };
    }

    const data = apiResult.data;
    if (data.session_token) {
      await setSessionToken(data.session_token);
    }

    return { success: true, data: { session_token: data.session_token } };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

export async function verifyOtpAction(values: unknown) {
  const sessionToken = await getSessionToken();
  const valuesWithToken = { ...(values as Record<string, any>), session_token: sessionToken };
  const parseResult = verifyOtpSchema.safeParse(valuesWithToken);
  if (!parseResult.success) {
    return { success: false, message: parseResult.error.errors[0]?.message || 'Invalid OTP input' };
  }

  try {
    const api = await getServerApi();
    const response = await api.post('/admin/auth/verify-otp/', parseResult.data);
    const apiResult = handleActionResponse(response.data);
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || 'OTP verification failed' };
    }

    const data = apiResult.data;
    if (data.reset_token) {
      await setResetToken(data.reset_token);
    }

    return { success: true, data: { reset_token: data.reset_token } };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

export async function resetPasswordAction(values: unknown) {
  const token = await getResetToken();
  const valuesWithToken = { ...(values as Record<string, any>), reset_token: token };
  const parseResult = resetPasswordSchema.safeParse(valuesWithToken);
  if (!parseResult.success) {
    return { success: false, message: parseResult.error.errors[0]?.message || 'Invalid reset values' };
  }

  try {
    const api = await getServerApi();
    const response = await api.post('/admin/auth/reset-password/', parseResult.data);
    const apiResult = handleActionResponse(response.data);
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || 'Reset failed' };
    }

    await clearAuthCookies();
    return { success: true, data: { message: apiResult.data.message } };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
