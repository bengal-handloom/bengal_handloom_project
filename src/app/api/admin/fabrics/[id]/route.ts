import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/requireAdmin";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  FABRICS_COLLECTION,
  fabricItemFromDoc,
  firestoreDataFromInput,
  parseFabricInput,
} from "@/lib/fabricCatalogFirestore";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const ref = adminDb.collection(FABRICS_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ fabric: fabricItemFromDoc(snap.id, snap.data()!) });
  } catch (err) {
    console.error("[admin/fabrics/:id GET]", err);
    const message = err instanceof Error ? err.message : "Failed to load fabric";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

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
    const ref = adminDb.collection(FABRICS_COLLECTION).doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await ref.update(firestoreDataFromInput(parsed.value, false));
    const updated = await ref.get();
    return NextResponse.json({ fabric: fabricItemFromDoc(ref.id, updated.data()!) });
  } catch (err) {
    console.error("[admin/fabrics/:id PATCH]", err);
    const message = err instanceof Error ? err.message : "Failed to update fabric";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const ref = adminDb.collection(FABRICS_COLLECTION).doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/fabrics/:id DELETE]", err);
    const message = err instanceof Error ? err.message : "Failed to delete fabric";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
