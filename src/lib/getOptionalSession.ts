import { adminAuth } from "@/lib/firebaseAdmin";
import { getSessionCookie } from "@/lib/session";

/** Any valid `dl_session` (approved user or admin). */
export async function getOptionalVerifiedSession() {
  const cookie = await getSessionCookie();
  if (!cookie) return null;
  try {
    return await adminAuth.verifySessionCookie(cookie, true);
  } catch {
    return null;
  }
}