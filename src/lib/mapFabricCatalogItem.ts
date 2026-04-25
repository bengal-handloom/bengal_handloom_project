import type { FabricCatalogItem } from "@/types/fabricCatalog";

const LOW_STOCK_M = 100;
const HIGH_STOCK_M = 800;

function capacityFromAvailable(availableYards: number) {
  const left = Math.max(0, availableYards);
  const total = Math.max(Math.round(left * 1.5), left, 1);
  let capacityStatus: FabricCatalogItem["capacityStatus"] = "normal";
  if (left < LOW_STOCK_M) capacityStatus = "low";
  else if (left > HIGH_STOCK_M) capacityStatus = "high";
  return { capacityLeft: left, capacityTotal: total, capacityStatus };
}

function badgeFromCollectionType(collectionType: string): FabricCatalogItem["badge"] {
  const t = collectionType.toLowerCase();
  if (t.includes("new")) return "NEW ARRIVAL";
  if (t.includes("premium")) return "PREMIUM";
  return null;
}

function enrichBase(raw: FabricCatalogItem): FabricCatalogItem {
  const cap = capacityFromAvailable(raw.availableYards);
  return {
    ...raw,
    ...cap,
    badge: badgeFromCollectionType(raw.collectionType),
  };
}

/** Full pricing & specs — only for authenticated sessions */
export function mapFabricCatalogItemFull(raw: FabricCatalogItem): FabricCatalogItem {
  return {
    ...enrichBase(raw),
    pricingVisible: true,
  };
}

/** Strip sensitive fields (also use on server before JSON for defense in depth) */
export function mapFabricCatalogItemPublic(raw: FabricCatalogItem): FabricCatalogItem {
  return {
    ...enrichBase(raw),
    pricePerYard: 0,
    pricingVisible: false,
  };
}

export function formatCatalogPricePerYard(fabric: FabricCatalogItem): string {
  if (fabric.pricingVisible === false) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(fabric.pricePerYard);
}

export function catalogOriginLabel(fabric: FabricCatalogItem): string {
  return fabric.location.trim() || fabric.region.trim() || "—";
}

export function catalogGsmLabel(fabric: FabricCatalogItem): string {
  if (fabric.pricingVisible === false) return "—";
  return fabric.gsm.trim() || "—";
}