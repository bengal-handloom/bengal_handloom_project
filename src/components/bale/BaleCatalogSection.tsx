"use client";

import { Box, Title, Text } from "@mantine/core";
import { BaleCatalogFilters } from "./BaleCatalogFilters";
import { BaleCatalogGrid } from "./BaleCatalogGrid";
import { WHOLESALE_FABRICS } from "@/data/wholeSaleFabric";
import { useBaleCatalogStore } from "@/stores/useBaleCatalogStore";
import { useMemo } from "react";
import type { FabricCatalogItem } from "@/types/fabricCatalog";
import { useCatalogFabrics } from "@/hooks/useCatalogFabrics";

function parsePrice(p: string): number {
  return parseFloat(p.replace(/[^0-9.]/g, "")) || 0;
}

function filterFabrics(
  fabrics: FabricCatalogItem[],
  stateFilter: string,
  priceRange: { min: number; max: number },
  clothRange: { min: number; max: number }
): FabricCatalogItem[] {
  return fabrics.filter((f) => {
    if (stateFilter !== "All States" && f.location !== stateFilter) return false;
    if (f.pricingVisible !== false) {
      const price = f.pricePerMeter;
      if (price < priceRange.min || price > priceRange.max) return false;
    }
    const left = f.capacityLeft ?? f.availableMeters;
    if (left < clothRange.min || left > clothRange.max) return false;
    return true;
  });
}

export function BaleCatalogSection() {
  const { fabrics, visibility, loading, error } = useCatalogFabrics();
  const stateFilter = useBaleCatalogStore((s) => s.stateFilter);
  const priceRange = useBaleCatalogStore((s) => s.priceRange);
  const clothAvailableRange = useBaleCatalogStore((s) => s.clothAvailableRange);
  const filtered = useMemo(
    () => filterFabrics(fabrics, stateFilter, priceRange, clothAvailableRange),
    [fabrics, stateFilter, priceRange, clothAvailableRange]
  );
  return (
    <Box className="flex h-full flex-col bg-[#1A1A1A]">
      <Box className="sticky top-0 z-20 border-b border-[#2a2a2a] bg-[#1A1A1A]/95 px-6 py-6 backdrop-blur-md lg:px-8">
        <Box className="mb-6 flex items-center justify-between">
          <Title order={1} className="text-2xl font-bold text-white">
            Artisan Collections <span className="ml-2 text-lg font-normal text-[#bdb29e]">2026</span>
          </Title>
        </Box>
        <BaleCatalogFilters hidePriceFilter={visibility === "public"} />
      </Box>
      <Box className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loading && <Text className="text-[#9d9589]">Loading catalog…</Text>}
        {error && <Text className="text-red-400">{error}</Text>}
        {!loading && !error && <BaleCatalogGrid fabrics={filtered} />}
      </Box>
    </Box>
  );
}