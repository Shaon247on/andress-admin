"use server";

import { getAccessToken } from "@/lib/cookies";

export async function getDecryptedAccessToken(): Promise<string | null> {
  try {
    const token = await getAccessToken();
    console.log('Token retrieved from cookies:', token ? 'Found' : 'Not found');
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}