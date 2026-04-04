"use client";

import { Box } from "@mantine/core";
import type { FabricCatalogItem } from "@/types/fabricCatalog";
import { BaleCatalogCard } from "./BaleCatalogCard";

interface BaleCatalogGridProps {
  fabrics: FabricCatalogItem[];
}

export function BaleCatalogGrid({ fabrics }: BaleCatalogGridProps) {
  return (
    <Box className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-2">
      {fabrics.map((fabric) => (
        <BaleCatalogCard key={fabric.id} fabric={fabric} />
      ))}
    </Box>
  );
}