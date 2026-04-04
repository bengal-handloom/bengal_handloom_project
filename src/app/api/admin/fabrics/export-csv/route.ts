import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/requireAdmin";
import { adminDb } from "@/lib/firebaseAdmin";
import { FABRICS_COLLECTION, fabricItemFromDoc } from "@/lib/fabricCatalogFirestore";
import type { FabricCatalogItem } from "@/types/fabricCatalog";

export const runtime = "nodejs";

const MAX_ROWS = 10_000;

/** Match import-csv column names so round-trip works */
const HEADERS = [
  "name",
  "imageLargeUrl",
  "imageSmallUrl",
  "location",
  "pricePerMeter",
  "weightPercent",
  "softnessPercent",
  "gsm",
  "region",
  "artisanKey",
  "availableMeters",
  "subHeader",
  "description",
  "collectionType",
] as const;

function escapeCell(value: string): string {
  const s = value ?? "";
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function itemToRow(f: FabricCatalogItem): string {
  const cells = [
    f.name,
    f.imageLargeUrl,
    f.imageSmallUrl,
    f.location,
    String(f.pricePerMeter),
    String(f.weightPercent),
    String(f.softnessPercent),
    f.gsm,
    f.region,
    f.artisanKey,
    String(f.availableMeters),
    f.subHeader,
    f.description,
    f.collectionType,
  ].map((c) => escapeCell(String(c)));
  return cells.join(",");
}

export async function GET() {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  try {
    const snap = await adminDb
      .collection(FABRICS_COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(MAX_ROWS)
      .get();

    const fabrics: FabricCatalogItem[] = snap.docs.map((doc) => fabricItemFromDoc(doc.id, doc.data()));

    const headerLine = HEADERS.join(",");
    const body = fabrics.map(itemToRow).join("\r\n");
    const csv = `\ufeff${headerLine}\r\n${body}`;

    const filename = `fabrics-export-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[admin/fabrics/export-csv GET]", err);
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}