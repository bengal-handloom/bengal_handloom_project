export type OrderStatus =
  | "admin_review"
  | "loom_allocation"
  | "in_production"
  | "shipped"
  | "completed"
  | "cancelled";

export type OrderLineSnapshot = {
  fabricId: string;
  name: string;
  yards: number;
  pricePerYard: number;
  imageSmallUrl?: string;
  imageLargeUrl?: string;
  subtotal: number;
};

export type AssignedArtisan = {
  title: string;
  name: string;
  bio: string;
  imageUrl: string;
  badge: string;
  quote: string;
};

export type OrderDTO = {
  id: string;
  userId: string;
  userEmail: string;
  orderNumber: string;
  status: OrderStatus;
  lines: OrderLineSnapshot[];
  totalYards: number;
  totalPrice: number;
  currency: string;
  assignedArtisan?: AssignedArtisan;
  createdAt: string | null;
  updatedAt: string | null;
};