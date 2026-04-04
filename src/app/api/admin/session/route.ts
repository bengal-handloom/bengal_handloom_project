import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const ADMIN_SESSION_COOKIE = "dl_session";
const SESSION_MAX_AGE_SEC = 5 * 24 * 60 * 60; // 5 days

function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

// POST /api/admin/session
// Body: { idToken: string }
export async function POST(req: NextRequest) {
  let body: { idToken?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const idToken = typeof body.idToken === "string" ? body.idToken.trim() : "";
  if (!idToken) {
    return NextResponse.json({ error: "idToken is required" }, { status: 400 });
  }

  let decoded: Awaited<ReturnType<typeof adminAuth.verifyIdToken>>;
  try {
    // Verifies token integrity, issuer, audience, expiry
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return unauthorized("Invalid or expired token");
  }

  // Require Firebase custom claim: { admin: true }
  if (decoded.admin !== true) {
    return forbidden("Admin privileges required");
  }

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_SEC * 1000,
    });

    (await cookies()).set(ADMIN_SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SEC,
    });
  } catch (err) {
    console.error("[api/admin/session][POST]", err);
    return NextResponse.json({ error: "Failed to create admin session" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    redirectTo: "/admin",
  });
}

// GET /api/admin/session
// Check if current cookie belongs to logged-in admin
export async function GET() {
  const sessionCookie = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionCookie) return unauthorized("No active session");

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (decoded.admin !== true) return forbidden("Admin privileges required");

    return NextResponse.json({
      ok: true,
      admin: {
        uid: decoded.uid,
        email: decoded.email ?? null,
      },
    });
  } catch {
    return unauthorized("Invalid session");
  }
}

// DELETE /api/admin/session
// Admin logout
export async function DELETE() {
  (await cookies()).set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}