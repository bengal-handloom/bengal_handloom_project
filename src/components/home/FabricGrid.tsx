"use client";

import { Grid, Container } from "@mantine/core";
import type { Fabric } from "@/types/fabric";
import { FabricCard } from "./FabricCard";

interface FabricGridProps {
  fabrics: Fabric[];
}

export function FabricGrid({ fabrics }: FabricGridProps) {
  return (
    <Container size="xl" className="px-6 py-12">
      <Grid gutter="xl">
        {fabrics.map((fabric) => (
          <Grid.Col key={fabric.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <FabricCard fabric={fabric} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}