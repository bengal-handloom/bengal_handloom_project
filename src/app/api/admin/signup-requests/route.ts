import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/requireAdmin";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/** Firestore Timestamp or plain object from JSON — normalize for JSON response */
function toIso(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as FirebaseFirestore.Timestamp).toDate().toISOString();
  }
  return null;
}

export type SignupRequestListItem = {
  id: string;
  fullName: string;
  jobTitle: string;
  companyName: string;
  websiteUrl: string;
  email: string;
  taxId: string;
  expectedYardage: string;
  preferredFabricType: string;
  brandVision: string;
  businessLicense: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export async function GET(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending";
  const limitRaw = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const limit = Math.min(Math.max(Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT, 1), MAX_LIMIT);

  try {
    let query = adminDb
      .collection("signupRequests")
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (status && status !== "all") {
      query = adminDb
        .collection("signupRequests")
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .limit(limit) as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
    }

    const snap = await query.get();

    const requests: SignupRequestListItem[] = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        fullName: String(d.fullName ?? ""),
        jobTitle: String(d.jobTitle ?? ""),
        companyName: String(d.companyName ?? ""),
        websiteUrl: String(d.websiteUrl ?? ""),
        email: String(d.email ?? "").toLowerCase(),
        taxId: String(d.taxId ?? ""),
        expectedYardage: String(d.expectedYardage ?? ""),
        preferredFabricType: String(d.preferredFabricType ?? ""),
        brandVision: String(d.brandVision ?? ""),
        businessLicense: String(d.businessLicense ?? ""),
        status: String(d.status ?? "unknown"),
        createdAt: toIso(d.createdAt),
        updatedAt: toIso(d.updatedAt),
      };
    });

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("[admin/signup-requests]", err);
    const message = err instanceof Error ? err.message : "Failed to list requests";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}