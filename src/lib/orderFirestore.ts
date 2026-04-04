import { FieldValue, type DocumentData, type Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import type { AssignedArtisan, OrderDTO, OrderLineSnapshot, OrderStatus } from "@/types/order";
import { PER_FABRIC_BALE_CAPACITY_M } from "@/constants/bale";

export const ORDERS_COLLECTION = "orders";

function toIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "object" && value && "toDate" in value) {
    return (value as Timestamp).toDate().toISOString();
  }
  return null;
}

export function orderFromDoc(id: string, d: DocumentData): OrderDTO {
  const lines = Array.isArray(d.lines) ? (d.lines as OrderLineSnapshot[]) : [];
  const num = (v: unknown) => (typeof v === "number" ? v : Number(v)) || 0;
  return {
    id,
    userId: String(d.userId ?? ""),
    userEmail: String(d.userEmail ?? ""),
    orderNumber: String(d.orderNumber ?? ""),
    status: (d.status as OrderStatus) || "admin_review",
    lines,
    totalMeters: num(d.totalMeters),
    totalPrice: num(d.totalPrice),
    currency: String(d.currency ?? "INR"),
    assignedArtisan: d.assignedArtisan as AssignedArtisan | undefined,
    createdAt: toIso(d.createdAt),
    updatedAt: toIso(d.updatedAt),
  };
}

function generateOrderNumber(): string {
  const y = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `WR-${y}-${n}`;
}

function validateLines(lines: OrderLineSnapshot[]): { ok: true } | { ok: false; error: string } {
  if (!lines.length) return { ok: false, error: "At least one line item is required" };
  const byFabric: Record<string, number> = {};
  for (const l of lines) {
    if (!l.fabricId || !l.name) return { ok: false, error: "Invalid line item" };
    if (l.meters < 50) return { ok: false, error: "Minimum 50m per line" };
    byFabric[l.fabricId] = (byFabric[l.fabricId] ?? 0) + l.meters;
  }
  for (const m of Object.values(byFabric)) {
    if (m > PER_FABRIC_BALE_CAPACITY_M) {
      return { ok: false, error: `Max ${PER_FABRIC_BALE_CAPACITY_M}m per fabric type` };
    }
  }
  return { ok: true };
}

export async function createOrderDoc(input: {
  userId: string;
  userEmail: string;
  lines: OrderLineSnapshot[];
  assignedArtisan?: AssignedArtisan;
}): Promise<{ ok: true; id: string; order: OrderDTO } | { ok: false; error: string }> {
  const v = validateLines(input.lines);
  if (!v.ok) return v;

  const totalMeters = input.lines.reduce((s, l) => s + l.meters, 0);
  const totalPrice = input.lines.reduce((s, l) => s + l.subtotal, 0);

  const ref = adminDb.collection(ORDERS_COLLECTION).doc();
  const orderNumber = generateOrderNumber();

  const defaultArtisan: AssignedArtisan = {
    title: "ASSIGNED ARTISAN",
    name: "The Rossi Family",
    bio: "Third-generation silk artisans based in Como. Your fabric will be personally hand-inspected before shipment to ensure zero imperfections.",
    imageUrl: "/assets/artisan-placeholder.jpg",
    badge: "MASTER WEAVER",
    quote: "Every thread tells a story of patience.",
  };

  await ref.set({
    userId: input.userId,
    userEmail: input.userEmail,
    orderNumber,
    status: "admin_review" as OrderStatus,
    lines: input.lines,
    totalMeters,
    totalPrice,
    currency: "INR",
    assignedArtisan: input.assignedArtisan ?? defaultArtisan,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const snap = await ref.get();
  return { ok: true, id: ref.id, order: orderFromDoc(ref.id, snap.data()!) };
}

export async function getOrderById(orderId: string): Promise<OrderDTO | null> {
  const snap = await adminDb.collection(ORDERS_COLLECTION).doc(orderId).get();
  if (!snap.exists) return null;
  return orderFromDoc(snap.id, snap.data()!);
}

type ListFilters = {
  userId?: string;
  email?: string;
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: "date" | "price";
  order: "asc" | "desc";
};

export async function listOrdersForQuery(f: ListFilters): Promise<OrderDTO[]> {
  const sortField = f.sort === "price" ? "totalPrice" : "createdAt";
  const dir = f.order === "asc" ? "asc" : "desc";

  let q = adminDb.collection(ORDERS_COLLECTION).orderBy(sortField, dir).limit(200);

  if (f.userId) {
    q = adminDb.collection(ORDERS_COLLECTION).where("userId", "==", f.userId).orderBy(sortField, dir).limit(200);
  }

  const snap = await q.get();
  let rows = snap.docs.map((d) => orderFromDoc(d.id, d.data()));

  if (f.email) {
    const e = f.email.trim().toLowerCase();
    rows = rows.filter((r) => r.userEmail.toLowerCase().includes(e));
  }
  if (f.status) rows = rows.filter((r) => r.status === f.status);
  if (f.minPrice != null) rows = rows.filter((r) => r.totalPrice >= f.minPrice!);
  if (f.maxPrice != null) rows = rows.filter((r) => r.totalPrice <= f.maxPrice!);
  if (f.dateFrom) {
    const t = new Date(f.dateFrom).getTime();
    rows = rows.filter((r) => (r.createdAt ? new Date(r.createdAt).getTime() >= t : false));
  }
  if (f.dateTo) {
    const t = new Date(f.dateTo).getTime();
    rows = rows.filter((r) => (r.createdAt ? new Date(r.createdAt).getTime() <= t : false));
  }

  if (f.userId && f.sort) {
    rows.sort((a, b) => {
      const av = f.sort === "price" ? a.totalPrice : new Date(a.createdAt || 0).getTime();
      const bv = f.sort === "price" ? b.totalPrice : new Date(b.createdAt || 0).getTime();
      return f.order === "asc" ? av - bv : bv - av;
    });
  }

  return rows;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const ref = adminDb.collection(ORDERS_COLLECTION).doc(orderId);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({ status, updatedAt: FieldValue.serverTimestamp() });
  return true;
}