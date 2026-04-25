import type { MetaData } from "@/types/metadata";

export type CatalogMetadataPublic = {
  collectionTypes: string[];
  regions: string[];
  locationsByRegion: Record<string, string[]>;
};

const EMPTY: CatalogMetadataPublic = {
  collectionTypes: [],
  regions: [],
  locationsByRegion: {},
};

export function normalizeCatalogMetadata(raw: unknown): CatalogMetadataPublic {
  if (!raw || typeof raw !== "object") return EMPTY;

  const d = raw as Partial<MetaData>;
  const types = d.fabrics?.all_collection_types;
  const collectionTypes = Array.isArray(types)
    ? [...new Set(types.filter((t): t is string => typeof t === "string" && t.trim() !== ""))].sort((a, b) =>
        a.localeCompare(b),
      )
    : [];

  const regionRaw = d.region;
  const locationsByRegion: Record<string, string[]> = {};
  if (regionRaw && typeof regionRaw === "object") {
    for (const [k, v] of Object.entries(regionRaw)) {
      if (!k.trim()) continue;
      if (!Array.isArray(v)) continue;
      const locs = [...new Set(v.filter((x): x is string => typeof x === "string" && x.trim() !== ""))].sort(
        (a, b) => a.localeCompare(b),
      );
      locationsByRegion[k.trim()] = locs;
    }
  }

  const regions = Object.keys(locationsByRegion).sort((a, b) => a.localeCompare(b));

  return { collectionTypes, regions, locationsByRegion };
}

export function allLocationsSorted(locationsByRegion: Record<string, string[]>): string[] {
  const set = new Set<string>();
  for (const locs of Object.values(locationsByRegion)) {
    for (const l of locs) {
      if (l.trim()) set.add(l.trim());
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function orderedCollectionTypes(
  metadataTypes: string[],
  fabrics: { collectionType: string }[],
): string[] {
  const fromFabrics = [
    ...new Set(
      fabrics.map((f) => f.collectionType).filter((t): t is string => typeof t === "string" && t.trim() !== ""),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of metadataTypes) {
    if (t.trim() && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  for (const t of fromFabrics) {
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

export function decodeCollectionType (encoded: string){
  return decodeURIComponent(encoded).split("_").join(" ")
}

export function encodeCollectioType(collection_type: string){
  return encodeURIComponent(collection_type.split(" ").join("_"))
}