import { NextRequest, NextResponse } from "next/server";
import { requireUserApi } from "@/lib/requireUser";
import { createOrderDoc, listOrdersForQuery } from "@/lib/orderFirestore";
import type { OrderLineSnapshot, OrderStatus } from "@/types/order";

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

function parseLinesFromBody(body: unknown): { ok: true; lines: OrderLineSnapshot[] } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid JSON body" };
  const b = body as Record<string, unknown>;
  const raw = b.lines;
  if (!Array.isArray(raw) || raw.length === 0) return { ok: false, error: "lines[] is required" };

  const lines: OrderLineSnapshot[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return { ok: false, error: "Invalid line item" };
    const row = item as Record<string, unknown>;
    const fabricId = String(row.fabricId ?? "").trim();
    const name = String(row.name ?? "").trim();
    const yards = typeof row.yards === "number" ? row.yards : Number(row.yards);
    const pricePerYard = typeof row.pricePerYard === "number" ? row.pricePerYard : Number(row.pricePerYard);

    if (!fabricId || !name) return { ok: false, error: "fabricId and name are required per line" };
    if (!Number.isFinite(yards) || !Number.isFinite(pricePerYard)) return { ok: false, error: "Invalid yards or pricePerYard" };
    if (yards < 50) return { ok: false, error: "Minimum 50yd per line" };
    if (pricePerYard < 0) return { ok: false, error: "Invalid pricePerYard" };

    const subtotal = Math.round(yards * pricePerYard * 100) / 100;
    lines.push({
      fabricId,
      name,
      yards,
      pricePerYard,
      imageSmallUrl: row.imageSmallUrl != null ? String(row.imageSmallUrl) : undefined,
      imageLargeUrl: row.imageLargeUrl != null ? String(row.imageLargeUrl) : undefined,
      subtotal,
    });
  }
  return { ok: true, lines };
}

/** POST — create order for the logged-in user */
export async function POST(req: NextRequest) {
  const auth = await requireUserApi();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseLinesFromBody(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const email =
    typeof (body as Record<string, unknown>).userEmail === "string"
      ? String((body as Record<string, unknown>).userEmail).trim()
      : auth.session.email ?? "";

  const result = await createOrderDoc({
    userId: auth.session.uid,
    userEmail: email || auth.session.email || "",
    lines: parsed.lines,
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ id: result.id, order: result.order }, { status: 201 });
}

/** GET — list orders for the logged-in user (filters / sort; email filter ignored) */
export async function GET(req: NextRequest) {
  const auth = await requireUserApi();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const sort = parseSort(searchParams);
  const order = parseOrderDir(searchParams);
  const status = parseOptionalStatus(searchParams);
  const minPrice = parseNum(searchParams.get("minPrice"));
  const maxPrice = parseNum(searchParams.get("maxPrice"));
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;
  const limit = Math.min(100, Math.max(1, parseNum(searchParams.get("limit")) ?? 50));
  const offset = Math.max(0, parseNum(searchParams.get("offset")) ?? 0);

  let rows = await listOrdersForQuery({
    userId: auth.session.uid,
    sort,
    order,
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