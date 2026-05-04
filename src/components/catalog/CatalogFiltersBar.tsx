"use client";

import { Group, Button, Text, Box, UnstyledButton, Select } from "@mantine/core";
import { useCatalogStore } from "@/stores/useCatalogStores";
import { useCatalogMetadata } from "@/hooks/useCatalogMetadata";
import { allLocationsSorted } from "@/lib/catalogMetadata";
import { LoadingMore } from "../home";

interface CatalogFiltersBarProps {
  showingCount: number;
  totalCount: number;
  /** When set, collection is fixed (e.g. dynamic collection page) */
  fixedCollectionType?: string;
}

export function CatalogFiltersBar({
  showingCount,
  totalCount,
  fixedCollectionType,
}: CatalogFiltersBarProps) {
  const { metadata, loading: metaLoading } = useCatalogMetadata();
  const catalogRegion = useCatalogStore((s) => s.catalogRegion);
  const setCatalogRegion = useCatalogStore((s) => s.setCatalogRegion);
  const catalogLocation = useCatalogStore((s) => s.catalogLocation);
  const setCatalogLocation = useCatalogStore((s) => s.setCatalogLocation);
  const viewMode = useCatalogStore((s) => s.viewMode);
  const setViewMode = useCatalogStore((s) => s.setViewMode);

  const locationData =
    catalogRegion && metadata?.locationsByRegion[catalogRegion]?.length
      ? ["", ...metadata.locationsByRegion[catalogRegion]]
      : ["", ...allLocationsSorted(metadata?.locationsByRegion ?? {})];

  const locationSelectData = locationData.map((loc) => ({
    value: loc,
    label: loc === "" ? "All locations" : loc,
  }));

  return (
    <Box className="sticky top-16 z-40 border-b border-[#2a2a2a] bg-[#0B0B0B]/95 px-6 py-4 backdrop-blur-sm lg:px-12">
      <Group justify="space-between" wrap="wrap" className="mx-auto max-w-[1400px] gap-4">
        <Box className="flex min-w-0 flex-1 flex-col gap-3">
          {fixedCollectionType ? (
            <Text size="sm" className="text-[#C5A059]">
              Collection: <span className="font-semibold text-white">{fixedCollectionType}</span>
            </Text>
          ) : null}
          {metaLoading ? (
            <LoadingMore />

          ) : (
            <>
              <Group gap="xs" wrap="wrap" className="overflow-x-auto pb-1 md:pb-0">
                <Button
                  size="sm"
                  variant={catalogRegion === "" ? "filled" : "default"}
                  color={catalogRegion === "" ? "gold" : "dark"}
                  className={
                    catalogRegion === ""
                      ? "whitespace-nowrap rounded-lg bg-[#C5A059] text-black font-semibold"
                      : "whitespace-nowrap rounded-lg border border-[#2a2a2a] bg-[#141414] text-white transition-colors hover:border-[#C5A059]/50"
                  }
                  onClick={() => setCatalogRegion("")}
                >
                  All regions
                </Button>
                {(metadata?.regions ?? []).map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={catalogRegion === r ? "filled" : "default"}
                    color={catalogRegion === r ? "gold" : "dark"}
                    className={
                      catalogRegion === r
                        ? "whitespace-nowrap rounded-lg bg-[#C5A059] text-black font-semibold"
                        : "whitespace-nowrap rounded-lg border border-[#2a2a2a] bg-[#141414] text-white transition-colors hover:border-[#C5A059]/50"
                    }
                    onClick={() => setCatalogRegion(r)}
                  >
                    {r}
                  </Button>
                ))}
              </Group>
              <Select
                size="sm"
                label="Location"
                placeholder="All locations"
                data={locationSelectData}
                value={catalogLocation}
                onChange={(v) => setCatalogLocation(v ?? "")}
                clearable
                classNames={{
                  input: "bg-[#141414] border-[#2a2a2a] text-white",
                  label: "text-[#bdb29e] text-xs",
                }}
                className="max-w-xs"
              />
            </>
          )}
        </Box>
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