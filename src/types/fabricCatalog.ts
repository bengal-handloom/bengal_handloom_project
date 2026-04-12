export type CapacityStatus = "normal" | "low" | "high";

export type FabricCatalogItem = {
  id: string;
  sku: string;
  imageLargeUrl: string;
  imageSmallUrl: string;
  name: string;
  location: string;
  pricePerYard: number;
  gsm: string;
  region: string;
  availableYards: number;
  subHeader: string;
  description: string;
  collectionType: string;
  createdAt: string | null;
  artisanKey?: string | null;
  updatedAt: string | null;
  /** Present on catalog API responses; omitted on admin list if not set */
  pricingVisible?: boolean;
  capacityLeft?: number;
  capacityTotal?: number;
  capacityStatus?: CapacityStatus;
  badge?: "PREMIUM" | "NEW ARRIVAL" | null;
};

export type FabricCatalogInput = {
  imageLargeUrl: string;
  imageSmallUrl: string;
  sku: string;
  name: string;
  location: string;
  artisanKey?: string | null;
  pricePerYard: number;
  gsm: string;
  region: string;
  availableYards: number;
  subHeader: string;
  description: string;
  collectionType: string;
};