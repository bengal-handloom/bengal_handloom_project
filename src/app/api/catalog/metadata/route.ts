import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { normalizeCatalogMetadata, type CatalogMetadataPublic } from "@/lib/catalogMetadata";

export const runtime = "nodejs";

const METADATA_DOC = "v0";
const CACHE_HEADER = "public, s-maxage=300, stale-while-revalidate=600";

export async function GET() {
  try {
    const snap = await adminDb.collection("metadata").doc(METADATA_DOC).get();
    const normalized: CatalogMetadataPublic = normalizeCatalogMetadata(snap.data());

    return NextResponse.json(normalized, {
      headers: {
        "Cache-Control": CACHE_HEADER,
      },
    });
  } catch (err) {
    console.error("[api/catalog/metadata GET]", err);
    const message = err instanceof Error ? err.message : "Failed to load metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}