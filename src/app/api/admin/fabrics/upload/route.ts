import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/requireAdmin";
import { buildFabricImageKey, uploadBufferToS3 } from "@/lib/s3";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fabricName = String(formData.get("fabricName") ?? "").trim();
    const imageKind = String(formData.get("imageKind") ?? "") as "large" | "small";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!fabricName) {
      return NextResponse.json({ error: "fabricName is required" }, { status: 400 });
    }
    if (imageKind !== "large" && imageKind !== "small") {
      return NextResponse.json({ error: "imageKind must be large or small" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const key = buildFabricImageKey({
      fabricName,
      imageKind,
      originalFileName: file.name,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await uploadBufferToS3({
      key,
      body: buffer,
      contentType: file.type || "application/octet-stream",
    });

    // Save key in Firebase field later from frontend submit flow
    return NextResponse.json({
      key: uploaded.key,
      publicUrl: uploaded.url,
      contentType: file.type,
      size: file.size,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}