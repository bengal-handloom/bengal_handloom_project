import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/requireAdmin";
import { getOrderById, updateOrderStatus } from "@/lib/orderFirestore";
import type { OrderStatus } from "@/types/order";

const STATUSES: OrderStatus[] = [
  "admin_review",
  "loom_allocation",
  "in_production",
  "shipped",
  "completed",
  "cancelled",
];

type Params = { orderId: string };

export async function PATCH(req: NextRequest, context: { params: Promise<Params> }) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;

  const { orderId } = await context.params;
  if (!orderId) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const status = (body as Record<string, unknown>).status;
  if (typeof status !== "string" || !STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Invalid or missing status" }, { status: 400 });
  }

  const ok = await updateOrderStatus(orderId, status as OrderStatus);
  if (!ok) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const order = await getOrderById(orderId);
  return NextResponse.json({ order });
}