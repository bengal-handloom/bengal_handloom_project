import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { requireAdminApi } from "@/lib/requireAdmin";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  FABRICS_COLLECTION,
  parseFabricInput,
  firestoreDataFromInput,
} from "@/lib/fabricCatalogFirestore";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

type RowResult = { row: number; name: string; action: "created" | "updated" | "error"; message?: string };

export async function POST(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required (multipart field: file)" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "CSV too large" }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as Record<string, string>[];

    const results: RowResult[] = [];
    let created = 0;
    let updated = 0;

    for (let i = 0; i < records.length; i++) {
      const rowNum = i + 2; // 1-based + header
      const row = records[i];

      const body = {
        name: row.name ?? row.Name ?? "",
        imageLargeUrl: row.imageLargeUrl ?? row.image_large_url ?? "",
        imageSmallUrl: row.imageSmallUrl ?? row.image_small_url ?? "",
        location: row.location ?? "",
        pricePerMeter: row.pricePerMeter ?? row.price_per_meter ?? "",
        weightPercent: row.weightPercent ?? row.weight_percent ?? "",
        softnessPercent: row.softnessPercent ?? row.softness_percent ?? "",
        gsm: row.gsm ?? "",
        artisanKey: row.artisanKey ?? "",
        region: row.region ?? "",
        availableMeters: row.availableMeters ?? row.available_meters ?? "",
        subHeader: row.subHeader ?? row.sub_header ?? "",
        description: row.description ?? "",
        collectionType: row.collectionType ?? row.collection_type ?? "",
      };

      const parsed = parseFabricInput(body);
      if (!parsed.ok) {
        results.push({ row: rowNum, name: String(body.name), action: "error", message: parsed.error });
        continue;
      }

      const input = parsed.value;
      const nameTrim = input.name.trim();

      try {
        const metadata_ref = adminDb.collection("metadata").doc("fabrics")
        const fabric_meta_snap =  await metadata_ref.get()
        const fabric_metadata =  fabric_meta_snap.data() as string[]

        if(!fabric_metadata.some(e=>e===row.collection_type)){
          await metadata_ref.set(firestoreDataFromInput(input, true));

        }
        const snap = await adminDb
          .collection(FABRICS_COLLECTION)
          .where("name", "==", nameTrim)
          .limit(1)
          .get();

        if (snap.empty) {
          const ref = adminDb.collection(FABRICS_COLLECTION).doc();
          await ref.set(firestoreDataFromInput(input, true));
          created++;
          results.push({ row: rowNum, name: nameTrim, action: "created" });
        } else {
          const doc = snap.docs[0];
          await doc.ref.update(firestoreDataFromInput(input, false));
          updated++;
          results.push({ row: rowNum, name: nameTrim, action: "updated" });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Write failed";
        results.push({ row: rowNum, name: nameTrim, action: "error", message: msg });
      }
    }

    return NextResponse.json({
      ok: true,
      totalRows: records.length,
      created,
      updated,
      results,
    });
  } catch (err) {
    console.error("[admin/fabrics/import-csv]", err);
    const message = err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}