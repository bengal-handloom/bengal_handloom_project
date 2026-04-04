// src/lib/session.ts
import { adminAuth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "dl_session";

export async function createSessionCookieFromIdToken(idToken: string) {
  // 5 days
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
  return sessionCookie;
}

export async function verifySessionCookie(sessionCookie: string) {
  return adminAuth.verifySessionCookie(sessionCookie, true); // check revocation
}

export async function setSessionCookie(sessionCookie: string) {
  (await cookies()).set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 5,
  });
}

export async function deleteSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function getSessionCookie() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}