"use server";

import { cookies } from "next/headers";

/**
 * Returns the access token used to authenticate the Socket.IO connection.
 *
 * NOTE: adjust the cookie name below ("accessToken") to whatever your
 * getServerApi()/auth setup actually stores — this is the one assumption
 * this file makes. If your token isn't in a cookie at all (e.g. it's only
 * ever attached server-side to outgoing API calls), you'll need to persist
 * a copy to an httpOnly cookie at login time so it can be read here.
 *
 * Next.js 15: cookies() returns a Promise now — must be awaited.
 */
export async function getSocketAccessTokenAction(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ?? null;
}