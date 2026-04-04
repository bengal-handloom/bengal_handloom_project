"use client";

import { Box, Text } from "@mantine/core";
import { CatalogFiltersBar } from "@/components/catalog/CatalogFiltersBar";
import { WholesaleFabricGrid } from "@/components/catalog/WholesaleFabricGrid";
import { useCatalogFabrics } from "@/hooks/useCatalogFabrics";

export function CatalogClientSection() {
  const { fabrics, loading, error } = useCatalogFabrics();

  if (loading) {
    return (
      <Box className="px-6 py-10 lg:px-12">
        <Text className="text-[#9d9589]">Loading…</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="px-6 py-10 lg:px-12">
        <Text className="text-red-400">{error}</Text>
      </Box>
    );
  }

  return (
    <>
      <CatalogFiltersBar showingCount={fabrics.length} totalCount={fabrics.length} />
      <WholesaleFabricGrid fabrics={fabrics} />
    </>
  );
}