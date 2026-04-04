"use client";

import { Box, Text } from "@mantine/core";
import { FeaturedFabricsBar } from "@/components/home/FeaturedFabricsBar";
import { FabricGrid } from "@/components/home/FabricGrid";
import { useCatalogFabrics } from "@/hooks/useCatalogFabrics";
import type { FabricCatalogItem } from "@/types/fabricCatalog";
import type { Fabric } from "@/types/fabric";

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
    name: item.name || "Untitled Fabric",
    sku: item.id,
    price: isVisible ? `₹${item.pricePerMeter}` : "Locked",
    minYards: item.availableMeters > 0 ? `${Math.min(50, item.availableMeters)} m` : "—",
    imageUrl: toPublicUrl(item.imageSmallUrl || item.imageLargeUrl),
    badge: item.collectionType || null,
    badgeVariant: premium ? "gold" : "default",
  };
}

export function HomeCatalogSection() {
  const { fabrics, visibility, loading, error } = useCatalogFabrics();

  const homeFabrics = fabrics.map((f) => toHomeFabric(f, visibility));

  return (
    <Box>
      <FeaturedFabricsBar
        title="Featured Fabrics"
        countLabel={`${homeFabrics.length} TEXTURES`}
      />

      {loading ? (
        <Box className="px-6 py-12">
          <Text className="text-[#9d9589]">Loading fabrics...</Text>
        </Box>
      ) : error ? (
        <Box className="px-6 py-12">
          <Text className="text-red-400">{error}</Text>
        </Box>
      ) : (
        <FabricGrid fabrics={homeFabrics} />
      )}
    </Box>
  );
}