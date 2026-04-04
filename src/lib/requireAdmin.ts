import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { getSessionCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export type AdminSession = {
  uid: string;
  email?: string;
};

/** For Route Handlers: returns null + Response on failure */
export async function requireAdminApi(): Promise<
  { ok: true; session: AdminSession } | { ok: false; response: NextResponse }
> {
  const cookie = await getSessionCookie();
  if (!cookie) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    if (decoded.admin !== true) {
      return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { ok: true, session: { uid: decoded.uid, email: decoded.email } };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

/** For Server Components / layouts */
export async function requireAdminPage(): Promise<AdminSession> {
  const cookie = await getSessionCookie();
  if (!cookie) {
    redirect("/admin/login"); // import { redirect } from "next/navigation"
  }
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    if (decoded.admin !== true) {
      redirect("/admin/login");
    }
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    redirect("/admin/login");
  }
}