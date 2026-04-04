import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { requireAdminApi } from "@/lib/requireAdmin";
import { triggerEmailStartWebhook } from "@/lib/webhooks";

export const runtime = "nodejs";

function generateTempPassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*?";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => chars[n % chars.length]).join("");
}

type SignupRequestDoc = {
  status?: string;
  email?: string;
  fullName?: string;
  companyName?: string;
  jobTitle?: string;
  websiteUrl?: string;
  taxId?: string;
  expectedYardage?: string;
  preferredFabricType?: string;
  brandVision?: string;
  businessLicense?: string;
};

export async function POST(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  let body: { requestId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const requestId = typeof body.requestId === "string" ? body.requestId.trim() : "";
  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  const requestRef = adminDb.collection("signupRequests").doc(requestId);
  const requestSnap = await requestRef.get();

  if (!requestSnap.exists) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const data = requestSnap.data() as SignupRequestDoc;
  if (data.status !== "pending") {
    return NextResponse.json({ error: "Request is not pending" }, { status: 409 });
  }

  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  if (!email) {
    return NextResponse.json({ error: "Missing email on request" }, { status: 400 });
  }

  const temporaryPassword = generateTempPassword(12);

  let userRecord;
  try {
    userRecord = await adminAuth.createUser({
      email,
      password: temporaryPassword,
      emailVerified: true,
      displayName: data.fullName?.trim() || undefined,
    });
  } catch (err: unknown) {
    const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code: string }).code) : "";
    if (code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "A user with this email already exists. Resolve in Firebase Console or merge accounts." },
        { status: 409 }
      );
    }
    console.error("[admin/approve] createUser", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  const uid = userRecord.uid;

  try {
    await requestRef.update({
      status: "approved",
      approvedAt: FieldValue.serverTimestamp(),
      approvedByUid: gate.session.uid,
      firebaseUid: uid,
      updatedAt: FieldValue.serverTimestamp(),
    });

    await adminDb.collection("users").doc(uid).set(
      {
        email,
        requestId,
        approved: true,
        mustChangePassword: true,
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("[admin/approve] firestore", err);
    try {
      await adminAuth.deleteUser(uid);
    } catch {
      /* best effort */
    }
    return NextResponse.json({ error: "Failed to persist approval" }, { status: 500 });
  }

  let passwordResetLink: string;
  try {
    passwordResetLink = await adminAuth.generatePasswordResetLink(email);
  } catch (err) {
    console.error("[admin/approve] generatePasswordResetLink", err);
    passwordResetLink = "";
  }

  try {
    await triggerEmailStartWebhook({
      requestId,
      firebaseUid: uid,
      email,
      fullName: data.fullName ?? null,
      companyName: data.companyName ?? null,
      temporaryPassword,
      passwordResetLink: passwordResetLink || null,
    });
  } catch (err) {
    console.error("[admin/approve] webhook", err);
    return NextResponse.json(
      { error: "User created but webhook failed. Retry or check logs.", firebaseUid: uid },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, firebaseUid: uid });
}