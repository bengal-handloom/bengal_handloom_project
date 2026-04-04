import { NextRequest, NextResponse } from "next/server";
import { requireUserApi } from "@/lib/requireUser";
import { getOrderById } from "@/lib/orderFirestore";

type Params = { orderId: string };

export async function GET(_req: NextRequest, context: { params: Promise<Params> }) {
  const auth = await requireUserApi();
  if (!auth.ok) return auth.response;

  const { orderId } = await context.params;
  if (!orderId) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

  const order = await getOrderById(orderId);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (order.userId !== auth.session.uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ order });
}