// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 400 });

  // Verify ID token
  const decoded = await adminAuth.verifyIdToken(idToken);
  const uid = decoded.uid;

  console.log(decoded)

  // Look up approval state
  const userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const user = userSnap.data() as any;
  if (!user.approved) return NextResponse.json({ error: "Not approved" }, { status: 403 });

  // Create a session cookie (HttpOnly)
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: 5 * 24 * 60 * 60 * 1000 });

  (await cookies()).set("dl_session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 24 * 60 * 60,
  });

  // // Webhook #2 close nurturing sequence
  // await triggerEmailStopWebhook({
  //   requestId: user.requestId,
  //   firebaseUid: uid,
  //   email: user.email,
  // });

  const redirectTo = "/catalog";
  return NextResponse.json({ redirectTo });
}