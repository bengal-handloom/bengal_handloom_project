"use client";

import { useCallback, useEffect, useState } from "react";
import type { FabricCatalogItem } from "@/types/fabricCatalog";

export type CatalogFabricsResponse = {
  visibility: "public" | "full";
  fabrics: FabricCatalogItem[];
};

export function useCatalogFabrics() {
  const [fabrics, setFabrics] = useState<FabricCatalogItem[]>([]);
  const [visibility, setVisibility] = useState<CatalogFabricsResponse["visibility"]>("public");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/catalog/fabrics", {
        credentials: "include",
        cache: "no-store",
      });
      const data = (await res.json()) as CatalogFabricsResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load fabrics");
      setFabrics(Array.isArray(data.fabrics) ? data.fabrics : []);
      setVisibility(data.visibility === "full" ? "full" : "public");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load fabrics");
      setFabrics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { fabrics, visibility, loading, error, reload: load };
}