import { CapacityStatus } from "./fabricCatalog";

export interface Fabric {
  id: string;
  sku: string;
  imageUrl: string;
  name: string;
  location: string;
  price: string;
  gsm: string;
  region: string;
  minYards: string;
  subHeader: string;
  artisanKey?: string | null;
  pricingVisible?: boolean;
  badge?: string | null;
  badgeVariant?: "default" | "gold";
}