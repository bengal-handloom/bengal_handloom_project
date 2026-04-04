"use client";

import { Grid, Container } from "@mantine/core";
import { WholesaleFabricCard } from "./WholesaleFabricCard";
import { useCatalogStore } from "@/stores/useCatalogStores";
import { FabricCatalogItem } from "@/types/fabricCatalog";

interface WholesaleFabricGridProps {
  fabrics: FabricCatalogItem[];
}
export function WholesaleFabricGrid({ fabrics }: WholesaleFabricGridProps) {
  const viewMode = useCatalogStore((s) => s.viewMode);

  return (
    <Container size="xl" className="px-6 py-10 lg:px-12">
      <Grid
        gutter="lg"
        className={viewMode === "list" ? "grid-cols-1" : ""}
      >
        {fabrics.map((fabric) => (
          <Grid.Col key={fabric.id} span={viewMode === "list" ? 12 : { base: 12, md: 6, lg: 4 }}>
            <WholesaleFabricCard fabric={fabric} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}