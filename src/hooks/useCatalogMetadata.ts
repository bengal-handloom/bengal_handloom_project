"use client";

import { useCallback, useEffect, useState } from "react";
import type { CatalogMetadataPublic } from "@/lib/catalogMetadata";

let memoryCache: { data: CatalogMetadataPublic; fetchedAt: number } | null = null;
const TTL_MS = 5 * 60 * 1000;

async function fetchMetadata(): Promise<CatalogMetadataPublic> {
  const res = await fetch("/api/catalog/metadata", { credentials: "same-origin" });
  const json = (await res.json()) as CatalogMetadataPublic & { error?: string };
  if (!res.ok) throw new Error(json.error || "Failed to load metadata");
  return {
    collectionTypes: Array.isArray(json.collectionTypes) ? json.collectionTypes : [],
    regions: Array.isArray(json.regions) ? json.regions : [],
    locationsByRegion:
      json.locationsByRegion && typeof json.locationsByRegion === "object" ? json.locationsByRegion : {},
  };
}

export function useCatalogMetadata() {
  const [data, setData] = useState<CatalogMetadataPublic | null>(() => memoryCache?.data ?? null);
  const [loading, setLoading] = useState(!memoryCache || Date.now() - memoryCache.fetchedAt >= TTL_MS);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    if (!force && memoryCache && Date.now() - memoryCache.fetchedAt < TTL_MS) {
      setData(memoryCache.data);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const next = await fetchMetadata();
      memoryCache = { data: next, fetchedAt: Date.now() };
      setData(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load metadata");
      setData({ collectionTypes: [], regions: [], locationsByRegion: {} });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const reload = useCallback(() => load(true), [load]);

  return { metadata: data, loading, error, reload };
}