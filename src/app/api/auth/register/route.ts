import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { uploadFileToS3 } from "@/lib/s3";

export const runtime = 'nodejs'; 

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

function requireString(v: unknown, field: string): string {
  if (typeof v !== "string" || !v.trim()) throw new Error(`${field} is required`);
  return v.trim();
}

function validateEmail(email: string): string {
  const normalized = email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error("Invalid email");
  return normalized;
}

function validateUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid URL protocol");
    return parsed.toString();
  } catch {
    throw new Error("Invalid websiteUrl");
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Unsupported content-type. Use multipart/form-data" },
        { status: 415 }
      );
    }

    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries());

    const fileEntry = formData.get("businessLicenseFile");
    if (!fileEntry || typeof fileEntry !== "object" || !("arrayBuffer" in fileEntry)) {
      throw new Error("businessLicenseFile is required");
    }

    const file = fileEntry as File;
    if (!file.size) throw new Error("businessLicenseFile is required");
    if (file.size > MAX_FILE_SIZE_BYTES) throw new Error("File too large (max 10MB)");
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new Error("Invalid file type. Allowed: PDF, JPG, JPEG, PNG");
    }

    const businessLicense = await uploadFileToS3({file, key:"registration/business-license"});

    const fullName = requireString(payload.fullName, "fullName");
    const jobTitle = requireString(payload.jobTitle, "jobTitle");
    const companyName = requireString(payload.companyName, "companyName");
    const websiteUrl = validateUrl(requireString(payload.websiteUrl, "websiteUrl"));
    const email = validateEmail(requireString(payload.email, "email"));
    const taxId = requireString(payload.taxId, "taxId");
    const expectedYardage = requireString(payload.expectedYardage, "expectedYardage");
    const preferredFabricType = requireString(payload.preferredFabricType, "preferredFabricType");
    const brandVision = requireString(payload.brandVision, "brandVision");

  console.log("Database Project ID:", adminDb.databaseId);
    const docRef = await adminDb.collection("signupRequests").add({
      fullName,
      jobTitle,
      companyName,
      websiteUrl,
      email,
      taxId,
      expectedYardage,
      preferredFabricType,
      brandVision,
      businessLicense:businessLicense.key,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, requestId: docRef.id }, { status: 201 });
  } catch (err: unknown) {


    console.log(err,JSON.stringify(err))
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}