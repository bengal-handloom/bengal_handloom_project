import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/requireAdmin";
import { getSignedReadUrl } from "@/lib/s3";

export const runtime = "nodejs";

type Body = {
  keys?: string[];
  expiresInSec?: number;
};

export async function POST(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const keys = Array.isArray(body.keys)
    ? body.keys.map((k) => String(k || "").trim()).filter(Boolean)
    : [];

  if (keys.length === 0) {
    return NextResponse.json({ urls: {} as Record<string, string> });
  }

  const expiresInSec =
    typeof body.expiresInSec === "number" && Number.isFinite(body.expiresInSec)
      ? body.expiresInSec
      : 60 * 10;

  try {
    const uniqueKeys = [...new Set(keys)];
    const pairs = await Promise.all(
      uniqueKeys.map(async (key) => {
        const { signedUrl } = await getSignedReadUrl({ keyOrUrl: key, expiresInSec });
        return [key, signedUrl] as const;
      })
    );

    return NextResponse.json({
      urls: Object.fromEntries(pairs) as Record<string, string>,
      expiresInSec,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to sign URLs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}