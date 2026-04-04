"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Group,
  NativeSelect,
  NumberInput,
  Table,
  Text,
  TextInput,
  Loader,
} from "@mantine/core";
import type { OrderDTO, OrderStatus } from "@/types/order";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "admin_review", label: "Admin review" },
  { value: "loom_allocation", label: "Loom allocation" },
  { value: "in_production", label: "In production" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function MyOrdersSection() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sort, setSort] = useState<"date" | "price">("date");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState<number | string>("");
  const [maxPrice, setMaxPrice] = useState<number | string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("sort", sort);
    params.set("order", orderDir);
    if (status) params.set("status", status);
    if (minPrice !== "" && minPrice != null) params.set("minPrice", String(minPrice));
    if (maxPrice !== "" && maxPrice != null) params.set("maxPrice", String(maxPrice));
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    try {
      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load orders");
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [sort, orderDir, status, minPrice, maxPrice, dateFrom, dateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Box>
      <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#C5A059]">
        My orders
      </Text>

      <Group align="flex-end" gap="md" wrap="wrap" className="mb-6">
        <NativeSelect
          label="Sort by"
          data={[
            { value: "date", label: "Date" },
            { value: "price", label: "Price" },
          ]}
          value={sort}
          onChange={(e) => setSort(e.currentTarget.value as "date" | "price")}
          classNames={{ input: "bg-[#141414] border-[#2a2a2a] text-white" }}
        />
        <NativeSelect
          label="Order"
          data={[
            { value: "desc", label: "Newest / High first" },
            { value: "asc", label: "Oldest / Low first" },
          ]}
          value={orderDir}
          onChange={(e) => setOrderDir(e.currentTarget.value as "asc" | "desc")}
          classNames={{ input: "bg-[#141414] border-[#2a2a2a] text-white" }}
        />
        <NativeSelect
          label="Status"
          data={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.currentTarget.value)}
          classNames={{ input: "bg-[#141414] border-[#2a2a2a] text-white" }}
        />
        <TextInput
          label="From date"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.currentTarget.value)}
          classNames={{ input: "bg-[#141414] border-[#2a2a2a] text-white" }}
        />
        <TextInput
          label="To date"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.currentTarget.value)}
          classNames={{ input: "bg-[#141414] border-[#2a2a2a] text-white" }}
        />
        <NumberInput
          label="Min price (INR)"
          value={minPrice}
          onChange={setMinPrice}
          min={0}
          classNames={{ input: "bg-[#141414] border-[#2a2a2a] text-white" }}
        />
        <NumberInput
          label="Max price (INR)"
          value={maxPrice}
          onChange={setMaxPrice}
          min={0}
          classNames={{ input: "bg-[#141414] border-[#2a2a2a] text-white" }}
        />
        <Button
          variant="outline"
          color="gray"
          className="border-[#2a2a2a] text-white"
          onClick={() => fetchOrders()}
        >
          Apply
        </Button>
      </Group>

      {loading && (
        <Group justify="center" py="xl">
          <Loader color="#C5A059" />
        </Group>
      )}
      {error && (
        <Text className="text-red-400" mb="md">
          {error}
        </Text>
      )}

      {!loading && !error && (
        <>
          <Text size="sm" className="mb-2 text-white/40">
            {total} order{total !== 1 ? "s" : ""}
          </Text>
          <Box className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
            <Table striped highlightOnHover className="text-sm text-white/90">
              <Table.Thead>
                <Table.Tr className="border-[#2a2a2a]">
                  <Table.Th>Order #</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {orders.map((o) => (
                  <Table.Tr key={o.id}>
                    <Table.Td className="font-medium text-white">{o.orderNumber}</Table.Td>
                    <Table.Td className="capitalize text-white/70">
                      {o.status.replace(/_/g, " ")}
                    </Table.Td>
                    <Table.Td>{formatInr(o.totalPrice)}</Table.Td>
                    <Table.Td className="text-white/50">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </Table.Td>
                    <Table.Td>
                      <Link
                        href={`/dashboard/orders/${o.id}`}
                        className="text-[#C5A059] hover:underline"
                      >
                        View
                      </Link>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
          {orders.length === 0 && (
            <Text className="mt-6 text-center text-white/40">
              No orders yet. Build a bale from the catalog to place your first request.
            </Text>
          )}
        </>
      )}
    </Box>
  );
}