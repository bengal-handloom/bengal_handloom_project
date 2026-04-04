"use client";

import { Group, Button, Text, Box, UnstyledButton } from "@mantine/core";
import type { OriginFilter } from "@/types/wholesale";
import { useCatalogStore } from "@/stores/useCatalogStores";

const ORIGINS: { value: OriginFilter; label: string }[] = [
  { value: "all", label: "All Origins" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Jaipur", label: "Jaipur" },
  { value: "Varanasi", label: "Varanasi" },
];

interface CatalogFiltersBarProps {
  showingCount: number;
  totalCount: number;
}

export function CatalogFiltersBar({ showingCount, totalCount }: CatalogFiltersBarProps) {
  const originFilter = useCatalogStore((s) => s.originFilter);
  const setOriginFilter = useCatalogStore((s) => s.setOriginFilter);
  const viewMode = useCatalogStore((s) => s.viewMode);
  const setViewMode = useCatalogStore((s) => s.setViewMode);

  return (
    <Box className="sticky top-16 z-40 border-b border-[#2a2a2a] bg-[#0B0B0B]/95 px-6 py-4 backdrop-blur-sm lg:px-12">
      <Group justify="space-between" wrap="wrap" className="mx-auto max-w-[1400px] gap-4">
        <Group gap="xs" wrap="nowrap" className="overflow-x-auto pb-1 md:pb-0">
          {ORIGINS.map(({ value, label }) => (
            <Button
              key={value}
              size="sm"
              variant={originFilter === value ? "filled" : "default"}
              color={originFilter === value ? "gold" : "dark"}
              className={
                originFilter === value
                  ? "whitespace-nowrap rounded-lg bg-[#C5A059] text-black font-semibold"
                  : "whitespace-nowrap rounded-lg border border-[#2a2a2a] bg-[#141414] text-white transition-colors hover:border-[#C5A059]/50"
              }
              onClick={() => setOriginFilter(value)}
            >
              {value === "all" ? label : (
                <>
                  {label}
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </>
              )}
            </Button>
          ))}
          <Box className="mx-2 h-6 w-px bg-[#2a2a2a]" />
          <Button
            size="sm"
            variant="default"
            className="whitespace-nowrap rounded-lg border border-[#2a2a2a] bg-[#141414] text-white hover:border-[#C5A059]/50"
          >
            <span className="material-symbols-outlined text-base">filter_list</span>
            More Filters
          </Button>
        </Group>
        <Group gap="xs" className="text-sm text-[#bdb29e]">
          <Text size="sm">
            Showing <span className="font-bold text-white">{showingCount}</span> of {totalCount} fabrics
          </Text>
          <Group gap={4} className="ml-4">
            <UnstyledButton
              onClick={() => setViewMode("grid")}
              className="rounded p-1.5 text-white hover:bg-[#141414]"
            >
              <span className="material-symbols-outlined">grid_view</span>
            </UnstyledButton>
            <UnstyledButton
              onClick={() => setViewMode("list")}
              className="rounded p-1.5 text-[#555] hover:bg-[#141414]"
            >
              <span className="material-symbols-outlined">view_list</span>
            </UnstyledButton>
          </Group>
        </Group>
      </Group>
    </Box>
  );
}