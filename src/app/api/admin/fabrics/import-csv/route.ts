import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { requireAdminApi } from "@/lib/requireAdmin";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  FABRICS_COLLECTION,
  parseFabricInput,
  firestoreDataFromInput,
} from "@/lib/fabricCatalogFirestore";
import admin from "firebase-admin";
import { MetaData } from "@/types/metadata";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

type RowResult = { row: number; sku: string; action: "created" | "updated" | "error"; message?: string };

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
        sku: row.sku ?? row.sku ?? "",
        name: row.name ?? row.Name ?? "",
        imageLargeUrl: row.imageLargeUrl ?? row.image_large_url ?? "",
        imageSmallUrl: row.imageSmallUrl ?? row.image_small_url ?? "",
        location: row.location ?? "",
        pricePerYard: row.pricePerYard ?? row.price_per_meter ?? "",
        gsm: row.gsm ?? "",
        artisanKey: row.artisanKey ?? "",
        region: row.region ?? "",
        availableYards: row.availableYards ?? row.available_yards ?? "",
        subHeader: row.subHeader ?? row.sub_header ?? "",
        description: row.description ?? "",
        collectionType: row.collectionType ?? row.collection_type ?? "",
      };

      const parsed = parseFabricInput(body);
      if (!parsed.ok) {
        results.push({ row: rowNum, sku: String(body.sku), action: "error", message: parsed.error });
        continue;
      }

      const input = parsed.value;
      const skuTrim = input.sku.trim();

      try {
        const metadata_ref = adminDb.collection("metadata").doc("v0");
        const fabric_meta_snap = await metadata_ref.get();
        const raw = fabric_meta_snap.data() as Partial<MetaData> | undefined;
        const existingTypes = raw?.fabrics?.all_collection_types;
        const types = Array.isArray(existingTypes) ? existingTypes : [];
        if (row.collectionType && !types.some((e) => e === row.collectionType)) {
          await metadata_ref.set(
            { fabrics: { all_collection_types: admin.firestore.FieldValue.arrayUnion(row.collectionType) } },
            { merge: true },
          );
        }
        const regionKey = (row.region ?? "").trim();
        const loc = (row.location ?? "").trim();
        if (regionKey && loc) {
          const regionMap =
            raw?.region && typeof raw.region === "object" && !Array.isArray(raw.region)
              ? (raw.region as Record<string, unknown>)
              : {};
          const locs = Array.isArray(regionMap[regionKey])
            ? (regionMap[regionKey] as string[])
            : [];
          if (!locs.some((e) => e === loc)) {
            try {
              await metadata_ref.update({
                [`region.${regionKey}`]: admin.firestore.FieldValue.arrayUnion(loc),
              });
            } catch {
              await metadata_ref.set(
                {
                  region: { [regionKey]: admin.firestore.FieldValue.arrayUnion(loc) },
                  fabrics: { all_collection_types: types.length ? types : [] },
                },
                { merge: true },
              );
            }
          }
        }

        const snap = await adminDb
          .collection(FABRICS_COLLECTION)
          .where("sku", "==", skuTrim)
          .limit(1)
          .get();

        if (snap.empty) {
          const ref = adminDb.collection(FABRICS_COLLECTION).doc(skuTrim);
          await ref.set(firestoreDataFromInput(input, true));
          created++;
          results.push({ row: rowNum, sku: skuTrim, action: "created" });
        } else {
          const doc = snap.docs[0];
          await doc.ref.update(firestoreDataFromInput(input, false));
          updated++;
          results.push({ row: rowNum, sku: skuTrim, action: "updated" });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Write failed";
        console.log(e)
        results.push({ row: rowNum, sku: skuTrim, action: "error", message: msg });
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