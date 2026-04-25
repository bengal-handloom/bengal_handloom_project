"use client";

import Link from "next/link";
import { Box, Title, Text, Button, Grid, Container, Group } from "@mantine/core";
import type { FabricCatalogItem } from "@/types/fabricCatalog";
import type { Fabric } from "@/types/fabric";
import { FabricCard } from "@/components/home/FabricCard";
import { encodeCollectioType } from "@/lib/catalogMetadata";

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
    sku: item.id,
    price: isVisible ? `₹${item.pricePerYard}` : "Locked",
    minYards: item.availableYards > 0 ? `${Math.min(50, item.availableYards)} yd` : "—",
    imageUrl: toPublicUrl(item.imageSmallUrl || item.imageLargeUrl),
    badge: item.collectionType || null,
    location: item.location,
    gsm: item.gsm,
    subHeader: item.subHeader,
    region: item.region,
    artisanKey: item.artisanKey,
    badgeVariant: premium ? "gold" : "default",
  };
}

function collectionHref(collectionType: string) {
  return `/catalog/${encodeCollectioType(collectionType)}`;
}

interface HomeCollectionSectionsProps {
  fabrics: FabricCatalogItem[];
  collectionOrder: string[];
  visibility: "public" | "full";
}

export function HomeCollectionSections({
  fabrics,
  collectionOrder,
  visibility,
}: HomeCollectionSectionsProps) {
  return (
    <Box className="space-y-16 pb-16">
      {collectionOrder.map((collectionType) => {
        const inCollection = fabrics.filter((f) => f.collectionType === collectionType).slice(0, 4);
        if (inCollection.length === 0) return null;

        const homeFabrics = inCollection.map((f) => toHomeFabric(f, visibility));

        return (
          <Box key={collectionType}>
            <Container size="xl" className="px-6 lg:px-12">
              <Group justify="space-between" align="center" className="mb-6 flex-wrap gap-4">
                <Title order={2} className="text-xl font-medium tracking-wide text-white">
                  {collectionType}
                </Title>
                <Button
                  component={Link}
                  href={collectionHref(collectionType)}
                  variant="default"
                  size="sm"
                  className="rounded-lg border border-[#C5A059] bg-transparent font-semibold text-[#C5A059] hover:bg-[#C5A059]/10"
                >
                  Show more
                </Button>
              </Group>
              <Grid gutter="lg">
                {homeFabrics.map((fabric) => (
                  <Grid.Col key={fabric.id} span={{ base: 12, sm: 12, md: 3 }}>
                    <FabricCard fabric={fabric} />
                  </Grid.Col>
                ))}
              </Grid>
            </Container>
          </Box>
        );
      })}
    </Box>
  );
}