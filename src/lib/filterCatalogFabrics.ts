import type { FabricCatalogItem } from "@/types/fabricCatalog";

export type CatalogFabricFilters = {
  searchQuery?: string;
  region?: string;
  location?: string;
  collectionType?: string;
};

export function filterCatalogFabrics(
  fabrics: FabricCatalogItem[],
  filters: CatalogFabricFilters,
): FabricCatalogItem[] {
  const q = (filters.searchQuery ?? "").trim().toLowerCase();
  const region = (filters.region ?? "").trim();
  const location = (filters.location ?? "").trim();
  const collectionType = (filters.collectionType ?? "").trim();

  return fabrics.filter((f) => {
    if (collectionType && f.collectionType !== collectionType) return false;
    if (region && f.region !== region) return false;
    if (location && f.location !== location) return false;
    if (q) {
      const hay = [f.name, f.gsm, f.location, f.region, f.collectionType, f.subHeader, f.description]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}