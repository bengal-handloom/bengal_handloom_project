"use client";

import { Box, Text, Title } from "@mantine/core";
import { useBaleStore } from "@/stores/useBaleStore";

export function BaleStageStats() {
  const lines = useBaleStore((s) => s.lines);
  const estimatedValue = useBaleStore((s) => s.estimatedValue());
  const lastAddedLineId = useBaleStore((s) => s.lastAddedLineId);
  const lastLine = lines.find((l) => l.lineId === lastAddedLineId);

  return (
    <Box className="relative z-10 flex w-full justify-between">
      <Box>
        <Title order={2} className="mb-1 text-2xl font-bold text-white lg:text-3xl">
          Current Manifest
        </Title>
        <Text size="sm" className="flex items-center gap-2 text-[#bdb29e]">
          <span className="material-symbols-outlined text-base">calendar_clock</span>
          Est. Shipping: Oct 24
        </Text>
      </Box>
      <Box className="text-right">
        <Text className="text-2xl font-bold text-[#C5A059] lg:text-3xl">
          ${estimatedValue.toFixed(2)}
        </Text>
        <Text size="xs" className="uppercase tracking-widest text-[#bdb29e]">
          Total Value
        </Text>
      </Box>
    </Box>
  );
}