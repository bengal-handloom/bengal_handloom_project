import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/requireAdmin";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  FABRICS_COLLECTION,
  fabricItemFromDoc,
  firestoreDataFromInput,
  parseFabricInput,
} from "@/lib/fabricCatalogFirestore";
import type { FabricCatalogItem } from "@/types/fabricCatalog";

export const runtime = "nodejs";

const MAX_ALL = 10_000;

function parsePageSize(raw: string | null): number | "all" {
  if (raw === "all") return "all";
  const n = Number(raw);
  if (n === 50) return 50;
  return 20;
}

export async function GET(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const pageRaw = Number(searchParams.get("page") ?? "1");
  const page = Math.max(1, Number.isFinite(pageRaw) ? pageRaw : 1);
  const pageSizeMode = parsePageSize(searchParams.get("pageSize"));

  try {
    const coll = adminDb.collection(FABRICS_COLLECTION);
    const countSnap = await coll.count().get();
    const total = countSnap.data().count;

    const limit = pageSizeMode === "all" ? MAX_ALL : pageSizeMode;
    const offset = pageSizeMode === "all" ? 0 : (page - 1) * limit;

    const collection_snap = await coll.select('collection_type').get();
    const types = new Set();
    collection_snap.forEach(doc => {
      types.add(doc.data().collection_type);
    });
    const snap = await coll.orderBy("createdAt", "desc").offset(offset).limit(limit).get();
   
    const fabrics: FabricCatalogItem[] = snap.docs.map((doc) => fabricItemFromDoc(doc.id, doc.data()));

    const totalPages =
      pageSizeMode === "all" ? 1 : Math.max(1, Math.ceil(total / (pageSizeMode as number)));

    return NextResponse.json({
      fabrics,
      total,
      page: pageSizeMode === "all" ? 1 : page,
      pageSize: pageSizeMode === "all" ? total : pageSizeMode,
      totalPages,
    });
  } catch (err) {
    console.error("[admin/fabrics GET]", err);
    const message = err instanceof Error ? err.message : "Failed to list fabrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseFabricInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const ref = adminDb.collection(FABRICS_COLLECTION).doc();
    await ref.set(firestoreDataFromInput(parsed.value, true));
    const created = await ref.get();
    const fabric = fabricItemFromDoc(ref.id, created.data()!);
    return NextResponse.json({ fabric });
  } catch (err) {
    console.error("[admin/fabrics POST]", err);
    const message = err instanceof Error ? err.message : "Failed to create fabric";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
