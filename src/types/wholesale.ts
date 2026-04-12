import type { FabricCatalogItem } from "@/types/fabricCatalog";

export interface BaleLine {
  lineId: string;
  fabric: FabricCatalogItem;
  yards: number;
}

export const INDIAN_STATES = [
  "All States",
  "West Bengal",
  "Andhra Pradesh",
  "Gujarat",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
] as const;

export type IndianStateFilter = (typeof INDIAN_STATES)[number];

export interface PriceRange {
  min: number;
  max: number;
}

export interface ClothAvailableRange {
  min: number;
  max: number;
}


export type ViewMode = "grid" | "list";

export type CapacityStatus = "normal" | "low" | "high";