import type { FabricCatalogInput, FabricCatalogItem } from "@/types/fabricCatalog";
import type { DocumentData, Timestamp } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";

export const FABRICS_COLLECTION = "fabrics";

function toIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "object" && value && "toDate" in value) {
    return (value as Timestamp).toDate().toISOString();
  }
  return null;
}

export function fabricItemFromDoc(id: string, d: DocumentData): FabricCatalogItem {
  const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
  return {
    id,
    imageLargeUrl: String(d.imageLargeUrl ?? ""),
    imageSmallUrl: String(d.imageSmallUrl ?? ""),
    name: String(d.name ?? ""),
    sku: String(d.name ?? ""),
    location: String(d.location ?? ""),
    pricePerYard: num(d.pricePerYard),
    gsm: String(d.gsm ?? ""),
    region: String(d.region ?? ""),
    availableYards: num(d.availableYards),
    subHeader: String(d.subHeader ?? ""),
    description: String(d.description ?? ""),
    artisanKey: d.artisanKey == null ? null : String(d.artisanKey),

    collectionType: String(d.collectionType ?? ""),
    createdAt: toIso(d.createdAt),
    updatedAt: toIso(d.updatedAt),
  };
}

export function parseFabricInput(body: unknown): { ok: true; value: FabricCatalogInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid JSON body" };
  const b = body as Record<string, unknown>;
  const name = String(b.name ?? "").trim();
  if (!name) return { ok: false, error: "Name is required" };

  const num = (v: unknown, fallback = 0) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const artisanKeyRaw = b.artisanKey;
  const artisanKey =
    artisanKeyRaw == null || artisanKeyRaw === ""
      ? null
      : String(artisanKeyRaw).trim();

  return {
    ok: true,
    value: {
      imageLargeUrl: String(b.imageLargeUrl ?? ""),
      imageSmallUrl: String(b.imageSmallUrl ?? ""),
      name,
      sku: String(b.sku),
      location: String(b.location ?? ""),
      pricePerYard: num(b.pricePerYard),
      gsm: String(b.gsm ?? ""),
      region: String(b.region ?? ""),
      availableYards: num(b.availableYards),
      subHeader: String(b.subHeader ?? ""),
      description: String(b.description ?? ""),
      collectionType: String(b.collectionType ?? ""),
      artisanKey
    },
  };
}

export function firestoreDataFromInput(input: FabricCatalogInput, isCreate: boolean) {
  const base = {
    ...input,
    updatedAt: FieldValue.serverTimestamp(),
  };
  return isCreate ? { ...base, createdAt: FieldValue.serverTimestamp() } : base;
}