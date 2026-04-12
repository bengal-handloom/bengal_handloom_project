"use client";

import { Box, Text, Title, Button } from "@mantine/core";
import type { FabricCatalogItem } from "@/types/fabricCatalog";
import { useBaleStore } from "@/stores/useBaleStore";
import { YARDS_PER_PIECE_CONST } from "@/constants/bale";
import { BaleCustomQuantityModal } from "./BaleCustomQuantityModal";
import { useState } from "react";
import {
  formatCatalogPricePerYard,
  catalogOriginLabel,
  catalogGsmLabel,
} from "@/lib/mapFabricCatalogItem";

interface BaleCatalogCardProps {
  fabric: FabricCatalogItem;
}

export function BaleCatalogCard({ fabric }: BaleCatalogCardProps) {
  const addToBale = useBaleStore((s) => s.addToBale);
  const [customOpen, setCustomOpen] = useState(false);
  const left = fabric.capacityLeft ?? fabric.availableYards;
  const canAdd50 = left >= YARDS_PER_PIECE_CONST && fabric.pricingVisible !== false;

  return (
    <>
      <Box className="group relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#222] transition-all duration-300 hover:border-[#C5A059]/50 hover:shadow-xl">
        <Box className="relative h-48 w-full overflow-hidden">
          <Box
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url('${fabric.imageSmallUrl || fabric.imageLargeUrl}')`,
            }}
          />
          {fabric.badge && (
            <Box className="absolute left-3 top-3 rounded border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium tracking-wider text-white backdrop-blur">
              {fabric.badge}
            </Box>
          )}
          <Box className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-[#222] to-transparent" />
        </Box>
        <Box className="p-5">
          <Title order={3} className="text-xl font-bold text-white group-hover:text-[#C5A059]">
            {fabric.name}
          </Title>
          <Text size="sm" className="mt-1 italic text-[#bdb29e]">
            {catalogOriginLabel(fabric)} • {catalogGsmLabel(fabric)} GSM
          </Text>
          <Box className="my-4 flex items-center gap-4 text-xs text-[#bdb29e]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">width</span>
              {left}yd left
            </span>
          </Box>
          <Box className="mt-6 flex items-center justify-between border-t border-[#2a2a2a] pt-4">
            <Text className="text-lg font-bold text-white">
              {formatCatalogPricePerYard(fabric)}
              <span className="text-xs font-normal text-[#bdb29e]">/yd</span>
            </Text>
            <Box className="flex gap-2">
              <Button
                size="sm"
                disabled={!canAdd50}
                className="rounded-lg bg-[#2a2a2a] font-bold text-white hover:bg-[#C5A059] hover:text-black"
                leftSection={<span className="material-symbols-outlined text-lg">add</span>}
                onClick={() => addToBale(fabric, YARDS_PER_PIECE_CONST)}
              >
                + Add 50yd
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={fabric.pricingVisible === false}
                className="rounded-lg border-[#2a2a2a] text-white hover:border-[#C5A059] hover:bg-[#C5A059]/10 hover:text-[#C5A059]"
                onClick={() => setCustomOpen(true)}
              >
                Custom
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <BaleCustomQuantityModal
        fabric={fabric}
        opened={customOpen}
        onClose={() => setCustomOpen(false)}
        onAdd={(yards: number) => {
          addToBale(fabric, yards);
          setCustomOpen(false);
        }}
      />
    </>
  );
}