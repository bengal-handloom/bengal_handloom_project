export interface Fabric {
    id: string;
    name: string;
    sku: string;
    price: string;
    minYards: string;
    imageUrl: string;
    badge?: string | null;
    badgeVariant?: "default" | "gold";
  }