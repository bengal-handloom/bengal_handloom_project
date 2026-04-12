"use client";

import { Box, Button, Text } from "@mantine/core";
import { useBaleStore } from "@/stores/useBaleStore";
import { BaleReviewModal } from "./BaleReviewModal";
import { useMemo, useState } from "react";
import { PER_FABRIC_BALE_CAPACITY_M } from "@/constants/bale";

export function BaleStageActions() {
  const totalYards = useBaleStore((s) => s.totalYards());
  const totalPieces = useBaleStore((s) => s.totalPieces());
  const lines = useBaleStore((s) => s.lines);
  const baleReviewModalDisclosure = useBaleStore((s) => s.baleReviewModalDisclosure);

  const fabricCapacityRows = useMemo(() => {
    const byId = new Map<string, { name: string; yards: number }>();
    for (const line of lines) {
      const id = line.fabric.id;
      const prev = byId.get(id);
      if (prev) prev.yards += line.yards;
      else byId.set(id, { name: line.fabric.name, yards: line.yards });
    }
    return Array.from(byId.entries()).map(([fabricId, { name, yards }]) => ({
      fabricId,
      name,
      yards,
      remaining: Math.max(0, PER_FABRIC_BALE_CAPACITY_M - yards),
      pct: Math.min(100, (yards / PER_FABRIC_BALE_CAPACITY_M) * 100),
    }));
  }, [lines]);

  return (
    <>

      <Box className="relative z-10 space-y-6 rounded-xl border border-[#2a2a2a]/50 bg-[#0B0B0B]/40 p-6 backdrop-blur-sm">
        <Box className="grid grid-cols-3 gap-4 border-b border-[#2a2a2a] pb-4">
          <Box>
            <Text className="text-2xl font-bold text-white">
              {totalYards.toFixed(0)}
              <span className="ml-1 text-sm font-normal text-[#bdb29e]">yd</span>
            </Text>
            <Text size="xs" className="uppercase tracking-wider text-[#bdb29e]">
              Net length
            </Text>
          </Box>
          <Box>
            <Text className="text-2xl font-bold text-white">
              {totalPieces}
              <span className="ml-1 text-sm font-normal text-[#bdb29e]">pieces</span>
            </Text>
            <Text size="xs" className="uppercase tracking-wider text-[#bdb29e]">
              Count
            </Text>
          </Box>
          <Box>
            <Text className="text-2xl font-bold text-white">
              {lines.length}
              <span className="ml-1 text-sm font-normal text-[#bdb29e]">rolls</span>
            </Text>
            <Text size="xs" className="uppercase tracking-wider text-[#bdb29e]">
              Variants
            </Text>
          </Box>
        </Box>

        <Box className="space-y-4">
          <Text className="text-sm font-medium text-white">Per-fabric bale capacity</Text>
          {fabricCapacityRows.length === 0 ? (
            <Text size="sm" className="text-[#bdb29e]">
              Add fabrics from the catalog. Each fabric type can hold up to {PER_FABRIC_BALE_CAPACITY_M}yd in this bale.
            </Text>
          ) : (
            fabricCapacityRows.map(({ fabricId, name, yards, remaining, pct }) => (
              <Box key={fabricId} className="space-y-2">
                <Box className="flex justify-between gap-2 text-sm">
                  <Text className="min-w-0 flex-1 truncate font-medium text-white" title={name}>
                    {name}
                  </Text>
                  <Text className="shrink-0 font-bold text-[#C5A059]">
                    {yards.toFixed(0)}yd / {PER_FABRIC_BALE_CAPACITY_M}yd
                  </Text>
                </Box>
                <Text size="xs" className="text-[#bdb29e]">
                  {remaining.toFixed(0)}yd more can be added for this fabric
                </Text>
                <Box className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
                  <Box
                    className="h-full rounded-full bg-[#C5A059] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Button
          fullWidth
          disabled={lines.length === 0}
          className="h-12 rounded-lg bg-[#C5A059] font-bold text-black shadow-[0_0_20px_rgba(194,163,91,0.2)] hover:bg-[#d4b468] disabled:pointer-events-none disabled:opacity-50"
          onClick={() => baleReviewModalDisclosure(true)}
        >
          Finalize Manifest
        </Button>
      </Box>
    </>
  );
}