"use client";

import { Box, Text } from "@mantine/core";
import { useMemo } from "react";
import { CatalogFiltersBar } from "@/components/catalog/CatalogFiltersBar";
import { WholesaleFabricGrid } from "@/components/catalog/WholesaleFabricGrid";
import { useCatalogFabrics } from "@/hooks/useCatalogFabrics";
import { useCatalogStore } from "@/stores/useCatalogStores";
import { filterCatalogFabrics } from "@/lib/filterCatalogFabrics";

interface CatalogClientSectionProps {
  fixedCollectionType?: string;
}

export function CatalogClientSection({ fixedCollectionType }: CatalogClientSectionProps) {
  const { fabrics, loading, error } = useCatalogFabrics();
  const searchQuery = useCatalogStore((s) => s.searchQuery);
  const catalogRegion = useCatalogStore((s) => s.catalogRegion);
  const catalogLocation = useCatalogStore((s) => s.catalogLocation);

  const filtered = useMemo(
    () =>
      filterCatalogFabrics(fabrics, {
        searchQuery,
        region: catalogRegion,
        location: catalogLocation,
        collectionType: fixedCollectionType,
      }),
    [fabrics, searchQuery, catalogRegion, catalogLocation, fixedCollectionType],
  );

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
      <CatalogFiltersBar
        showingCount={filtered.length}
        totalCount={fabrics.length}
        fixedCollectionType={fixedCollectionType}
      />
      <WholesaleFabricGrid fabrics={filtered} />
    </>
  );
}