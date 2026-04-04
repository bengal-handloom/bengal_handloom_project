import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/requireAdmin";
import { listOrdersForQuery } from "@/lib/orderFirestore";
import type { OrderStatus } from "@/types/order";

const STATUSES: OrderStatus[] = [
  "admin_review",
  "loom_allocation",
  "in_production",
  "shipped",
  "completed",
  "cancelled",
];

function parseSort(searchParams: URLSearchParams): "date" | "price" {
  const s = searchParams.get("sort");
  return s === "price" ? "price" : "date";
}

function parseOrderDir(searchParams: URLSearchParams): "asc" | "desc" {
  const o = (searchParams.get("order") || "desc").toLowerCase();
  return o === "asc" ? "asc" : "desc";
}

function parseOptionalStatus(searchParams: URLSearchParams): OrderStatus | undefined {
  const raw = searchParams.get("status");
  if (!raw) return undefined;
  return STATUSES.includes(raw as OrderStatus) ? (raw as OrderStatus) : undefined;
}

function parseNum(param: string | null): number | undefined {
  if (param == null || param === "") return undefined;
  const n = Number(param);
  return Number.isFinite(n) ? n : undefined;
}

/** GET — all orders (filters + sort + pagination). Optional email substring filter. */
export async function GET(req: NextRequest) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;

  const { searchParams } = new URL(req.url);
  const sort = parseSort(searchParams);
  const order = parseOrderDir(searchParams);
  const status = parseOptionalStatus(searchParams);
  const minPrice = parseNum(searchParams.get("minPrice"));
  const maxPrice = parseNum(searchParams.get("maxPrice"));
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;
  const email = searchParams.get("email")?.trim() || undefined;
  const limit = Math.min(200, Math.max(1, parseNum(searchParams.get("limit")) ?? 50));
  const offset = Math.max(0, parseNum(searchParams.get("offset")) ?? 0);

  let rows = await listOrdersForQuery({
    sort,
    order,
    email,
    status,
    minPrice,
    maxPrice,
    dateFrom,
    dateTo,
  });

  const total = rows.length;
  rows = rows.slice(offset, offset + limit);

  return NextResponse.json({ orders: rows, total, limit, offset });
}