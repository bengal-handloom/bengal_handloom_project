"use client";

import { Box, Text } from "@mantine/core";
import { useMemo } from "react";
import { FeaturedFabricsBar } from "@/components/home/FeaturedFabricsBar";
import { useCatalogFabrics } from "@/hooks/useCatalogFabrics";
import { useCatalogMetadata } from "@/hooks/useCatalogMetadata";
import { useCatalogStore } from "@/stores/useCatalogStores";
import { filterCatalogFabrics } from "@/lib/filterCatalogFabrics";
import { orderedCollectionTypes } from "@/lib/catalogMetadata";
import { HomeLocationFilters } from "@/components/home/HomeLocationFilters";
import { HomeCollectionSections } from "@/components/home/HomeCollectionSections";

export function HomeCatalogSection() {
  const { fabrics, visibility, loading, error } = useCatalogFabrics();
  const { metadata, loading: metaLoading } = useCatalogMetadata();
  const catalogRegion = useCatalogStore((s) => s.catalogRegion);
  const catalogLocation = useCatalogStore((s) => s.catalogLocation);

  const filteredFabrics = useMemo(
    () =>
      filterCatalogFabrics(fabrics, {
        region: catalogRegion,
        location: catalogLocation,
      }),
    [fabrics, catalogRegion, catalogLocation],
  );

  const collectionOrder = useMemo(
    () => orderedCollectionTypes(metadata?.collectionTypes ?? [], filteredFabrics),
    [metadata?.collectionTypes, filteredFabrics],
  );

  return (
    <Box>
      <FeaturedFabricsBar
        title="Collections"
        countLabel={`${filteredFabrics.length} TEXTURES`}
      />

      <HomeLocationFilters />

      {loading || metaLoading ? (
        <Box className="px-6 py-12">
          <Text className="text-[#9d9589]">Loading fabrics…</Text>
        </Box>
      ) : error ? (
        <Box className="px-6 py-12">
          <Text className="text-red-400">{error}</Text>
        </Box>
      ) : (
        <HomeCollectionSections
          fabrics={filteredFabrics}
          collectionOrder={collectionOrder}
          visibility={visibility}
        />
      )}
    </Box>
  );
}