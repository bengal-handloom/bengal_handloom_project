"use client";

import { Box, Text, Grid, Container } from "@mantine/core";
import { useMemo } from "react";
import { CatalogFiltersBar } from "@/components/catalog/CatalogFiltersBar";
import { WholesaleFabricGrid } from "@/components/catalog/WholesaleFabricGrid";
import { FabricCard } from "@/components/home/FabricCard";
import { useCatalogFabrics } from "@/hooks/useCatalogFabrics";
import { useCatalogStore } from "@/stores/useCatalogStores";
import { filterCatalogFabrics } from "@/lib/filterCatalogFabrics";
import type { FabricCatalogItem } from "@/types/fabricCatalog";
import type { Fabric } from "@/types/fabric";

interface CatalogClientSectionProps {
  fixedCollectionType?: string;
}

const S3_PUBLIC_BASE = (process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BASE_URL || "").replace(/\/+$/, "");

function toPublicUrl(keyOrUrl: string): string {
  if (!keyOrUrl) return "";
  if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl;
  return S3_PUBLIC_BASE ? `${S3_PUBLIC_BASE}/${keyOrUrl.replace(/^\/+/, "")}` : keyOrUrl;
}

function toHomeFabric(item: FabricCatalogItem, visibility: "public" | "full"): Fabric {
  const premium = item.collectionType?.toLowerCase().includes("premium");
  const isVisible = visibility === "full" && (item.pricingVisible ?? true);

  return {
    id: item.id,
    name: item.name || "New Fabric",
    sku: item.sku || item.id,
    price: isVisible ? `₹${item.pricePerYard}` : "Locked",
    minYards: item.availableYards > 0 ? `${Math.min(50, item.availableYards)} yd` : "—",
    imageUrl: toPublicUrl(item.imageSmallUrl || item.imageLargeUrl),
    badge: item.collectionType || null,
    location: item.location,
    gsm: item.gsm,
    subHeader: item.subHeader,
    region: item.region,
    artisanKey: item.artisanKey,
    pricingVisible: isVisible,
    badgeVariant: premium ? "gold" : "default",
  };
}

export function CatalogClientSection({ fixedCollectionType }: CatalogClientSectionProps) {
  const { fabrics, visibility, loading, error } = useCatalogFabrics();
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

      {visibility === "full" ? (
        <WholesaleFabricGrid fabrics={filtered} />
      ) : (
        <Container size="xl" className="px-6 py-10 lg:px-12">
          <Grid gutter="lg">
            {filtered.map((f) => {
              const fabric = toHomeFabric(f, visibility);
              return (
                <Grid.Col key={fabric.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <FabricCard fabric={fabric} />
                </Grid.Col>
              );
            })}
          </Grid>
        </Container>
      )}
    </>
  );
}