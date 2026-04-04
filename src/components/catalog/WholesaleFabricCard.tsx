"use client";

import { Box, Title, Text, Button, Progress, Group } from "@mantine/core";
import type { FabricCatalogItem } from "@/types/fabricCatalog";
import { useBaleStore } from "@/stores/useBaleStore";
import {
  formatCatalogPricePerMeter,
  catalogOriginLabel,
  catalogGsmLabel,
} from "@/lib/mapFabricCatalogItem";
import Link from "next/link";

interface WholesaleFabricCardProps {
  fabric: FabricCatalogItem;
}

function capacityBarColor(status: string) {
  if (status === "low") return "red";
  if (status === "high") return "green";
  return "#C5A059";
}

function capacityLabel(fabric: FabricCatalogItem) {
  const left = fabric.capacityLeft ?? fabric.availableMeters;
  const status = fabric.capacityStatus ?? "normal";
  if (status === "low")
    return <span className="text-red-400">Low Stock ({left}m)</span>;
  return <span className="text-[#C5A059]">{left}m left</span>;
}

export function WholesaleFabricCard({ fabric }: WholesaleFabricCardProps) {
  const addToBale = useBaleStore((s) => s.addToBale);
  const items = useBaleStore((s) => s.lines);
  const isInBale = items.some((i) => i.fabric.id === fabric.id);
  const left = fabric.capacityLeft ?? fabric.availableMeters;
  const total = Math.max(fabric.capacityTotal ?? left, 1);
  const capacityPct = (left / total) * 100;
  return (
    <Box className="group relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#141414] transition-all duration-300 hover:border-[#C5A059]/50 hover:shadow-2xl hover:shadow-black/50">
      <Box className="relative aspect-[3/4] w-full overflow-hidden">
        {fabric.badge && (
          <Box className="absolute top-4 left-4 z-20">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                fabric.badge === "NEW ARRIVAL"
                  ? "bg-[#C5A059] text-black"
                  : "border-white/10 bg-black/60 text-white backdrop-blur-md"
              }`}
            >
              {fabric.badge}
            </span>
          </Box>
        )}
        <Box
          className="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url('${fabric.imageSmallUrl || fabric.imageLargeUrl}')` }}
        />
        <Box className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="sm"
            className="translate-y-4 rounded-full bg-white font-bold text-black transition-transform duration-300 group-hover:translate-y-0"
          >
            Quick View
          </Button>
        </Box>
      </Box>
      <Box className="flex flex-col gap-4 p-5">
        <Group justify="space-between" align="flex-start">
          <Title order={3} className="text-lg font-bold leading-tight text-white">
            {fabric.name}
          </Title>
          <Text fw={700} size="lg" className="text-[#C5A059]">
            {formatCatalogPricePerMeter(fabric)}
            <span className="text-xs font-normal text-[#777]">/m</span>
          </Text>
        </Group>
        <Text size="sm" className="text-[#888]">
          {catalogOriginLabel(fabric)} • {catalogGsmLabel(fabric)} GSM
        </Text>
        {fabric.artisanKey && (
          <Link
            href={`/artisans/${fabric.artisanKey}`}
            className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] hover:underline"
          >
            Artisan history →
          </Link>
        )}
        <Box className="space-y-1.5 border-y border-[#2a2a2a] py-2">
          <Group gap="xs" className="text-xs">
            <span className="w-16 text-[#bdb29e]">Softness</span>
            <Progress
              value={fabric.softnessPercent}
              size="xs"
              color="gray"
              className="flex-1"
            />
          </Group>
          <Group gap="xs" className="text-xs">
            <span className="w-16 text-[#bdb29e]">Structure</span>
            <Progress
              value={fabric.weightPercent}
              size="xs"
              color="gray"
              className="flex-1"
            />
          </Group>
        </Box>
        <Box className="flex flex-col gap-3">
          <Box className="flex flex-col gap-1">
            <Group justify="space-between" className="mb-1 text-xs">
              <span className="text-white">Loom Capacity</span>
              {capacityLabel(fabric)}
            </Group>
            <Progress
              value={capacityPct}
              size="xs"
              color={capacityBarColor(fabric.capacityStatus ?? "normal")}
              className="rounded-full"
            />
          </Box>
          <Button
            fullWidth
            leftSection={<span className="material-symbols-outlined text-lg">add_circle</span>}
            className={
              isInBale
                ? "rounded-lg border border-[#C5A059] bg-[#C5A059] font-bold text-black hover:bg-[#b08d4b]"
                : "rounded-lg border border-[#C5A059] bg-transparent font-bold text-[#C5A059] hover:bg-[#C5A059] hover:text-black"
            }
            disabled={fabric.pricingVisible === false}
            onClick={() => addToBale(fabric, 50)}
          >
            Add to Bale
          </Button>
        </Box>
      </Box>
    </Box>
  );
}