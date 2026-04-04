import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebaseAdmin";
import { getSessionCookie } from "@/lib/session";

export type UserSession = { uid: string; email?: string };

export async function requireUserApi(): Promise<
  { ok: true; session: UserSession } | { ok: false; response: NextResponse }
> {
  const cookie = await getSessionCookie();
  if (!cookie) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    return { ok: true, session: { uid: decoded.uid, email: decoded.email } };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

export async function requireUserPage(): Promise<UserSession> {
  const cookie = await getSessionCookie();
  if (!cookie) redirect("/login?next=/dashboard");
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    redirect("/login?next=/dashboard");
  }
}