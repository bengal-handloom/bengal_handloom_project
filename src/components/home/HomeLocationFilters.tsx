"use client";

import { Box, Group, Button, Select, Text } from "@mantine/core";
import { useCatalogMetadata } from "@/hooks/useCatalogMetadata";
import { useCatalogStore } from "@/stores/useCatalogStores";
import { allLocationsSorted } from "@/lib/catalogMetadata";

export function HomeLocationFilters() {
  const { metadata, loading } = useCatalogMetadata();
  const catalogRegion = useCatalogStore((s) => s.catalogRegion);
  const setCatalogRegion = useCatalogStore((s) => s.setCatalogRegion);
  const catalogLocation = useCatalogStore((s) => s.catalogLocation);
  const setCatalogLocation = useCatalogStore((s) => s.setCatalogLocation);

  const locationData =
    catalogRegion && metadata?.locationsByRegion[catalogRegion]?.length
      ? ["", ...metadata.locationsByRegion[catalogRegion]]
      : ["", ...allLocationsSorted(metadata?.locationsByRegion ?? {})];

  const locationSelectData = locationData.map((loc) => ({
    value: loc,
    label: loc === "" ? "All locations" : loc,
  }));

  return (
    <Box className="border-b border-[#2a2a2a] bg-[#0B0B0B]/95 px-6 py-4 lg:px-12">
      <Box className="mx-auto max-w-[1400px]">
        <Text size="sm" className="mb-3 font-medium text-white">
          Filter by location
        </Text>
        {loading ? (
          <Text size="sm" className="text-[#9d9589]">
            Loading…
          </Text>
        ) : (
          <Group align="flex-end" wrap="wrap" gap="md">
            <Group gap="xs" wrap="wrap">
              <Button
                size="sm"
                variant={catalogRegion === "" ? "filled" : "default"}
                className={
                  catalogRegion === ""
                    ? "rounded-lg bg-[#C5A059] text-black font-semibold"
                    : "rounded-lg border border-[#2a2a2a] bg-[#141414] text-white"
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
                  className={
                    catalogRegion === r
                      ? "rounded-lg bg-[#C5A059] text-black font-semibold"
                      : "rounded-lg border border-[#2a2a2a] bg-[#141414] text-white"
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
                input: "bg-[#141414] border-[#2a2a2a] text-white min-w-[200px]",
                label: "text-[#bdb29e] text-xs",
              }}
            />
          </Group>
        )}
      </Box>
    </Box>
  );
}