"use client";

import Link from "next/link";
import { Group, Button, Text, Box } from "@mantine/core";
import { useBaleStore } from "@/stores/useBaleStore";

export function BaleFloatingBar() {
  const items = useBaleStore((s) => s.lines);
  const estimatedValue = useBaleStore((s) => s.estimatedValue());
  const value = estimatedValue;

  if (items.length === 0) return null;

  const displayItems = items.slice(0, 3);

  return (
    <Box className="pointer-events-none fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      <Box className="glass-panel pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-6 rounded-2xl border border-white/10 p-4 shadow-2xl shadow-black md:gap-12 md:p-5">
        <Group gap="md">
          <Group gap="xs" className="-space-x-3">
            {displayItems.map((item) => (
              <Box
                key={item.lineId}
                className="h-10 w-10 rounded-full border-2 border-[#141414] bg-cover bg-center"
                style={{
                  backgroundImage: `url('${item.fabric.imageSmallUrl || item.fabric.imageLargeUrl}')`,
                }}              />
            ))}
            {items.length > 3 && (
              <Box className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#141414] bg-[#2a2a2a] text-xs font-bold text-white">
                +{items.length - 3}
              </Box>
            )}
          </Group>
          <Box className="flex flex-col">
            <Text fw={700} className="text-white">
              {items.length} Swatch{items.length !== 1 ? "es" : ""} Selected
            </Text>
            <Text size="xs" className="text-[#bdb29e]">
              Est. Value: ${value.toFixed(2)}
            </Text>
          </Box>
        </Group>
        <Button
          component={Link}
          href="/bale"
          color="gold"
          className="whitespace-nowrap rounded-xl bg-[#C5A059] px-6 py-3 font-bold text-black shadow-lg shadow-[#C5A059]/20 hover:bg-[#b08d4b]"
          rightSection={<span className="material-symbols-outlined text-lg">arrow_forward</span>}
        >
          Proceed to Bale Builder
        </Button>
      </Box>
    </Box>
  );
}