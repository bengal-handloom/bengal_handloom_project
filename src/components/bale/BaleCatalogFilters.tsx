"use client";

import { Box, Button, NumberInput } from "@mantine/core";
import { useBaleCatalogStore } from "@/stores/useBaleCatalogStore";
import { INDIAN_STATES } from "@/types/wholesale";
import { useState } from "react";

interface BaleCatalogFiltersProps {
  hidePriceFilter?: boolean;
}

export function BaleCatalogFilters({ hidePriceFilter }: BaleCatalogFiltersProps) {
  const stateFilter = useBaleCatalogStore((s) => s.stateFilter);
  const setStateFilter = useBaleCatalogStore((s) => s.setStateFilter);
  const priceRange = useBaleCatalogStore((s) => s.priceRange);
  const setPriceRange = useBaleCatalogStore((s) => s.setPriceRange);
  const clothRange = useBaleCatalogStore((s) => s.clothAvailableRange);
  const setClothRange = useBaleCatalogStore((s) => s.setClothAvailableRange);
  const [stateOpen, setStateOpen] = useState(false);

  return (
    <Box className="flex flex-wrap gap-3">
      <Box className="relative">
        <Button
          variant="subtle"
          className="rounded-full border border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
          onClick={() => setStateOpen((o) => !o)}
          rightSection={<span className="material-symbols-outlined text-base">arrow_drop_down</span>}
        >
          {stateFilter}
        </Button>
        {stateOpen && (
          <Box className="absolute top-full left-0 z-30 mt-1 max-h-60 w-48 overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#1A1A1A] py-1">
            {INDIAN_STATES.map((s) => (
              <button
                key={s}
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2a2a2a]"
                onClick={() => {
                  setStateFilter(s);
                  setStateOpen(false);
                }}
              >
                {s}
              </button>
            ))}
          </Box>
        )}
      </Box>
      {!hidePriceFilter && <Box className="flex items-center gap-2">
        <NumberInput
          size="xs"
          placeholder="Min ₹"
          min={0}
          value={priceRange.min || ""}
          onChange={(v) => setPriceRange({ ...priceRange, min: Number(v) || 0 })}
          classNames={{ input: "bg-[#222] border-[#2a2a2a] text-white w-24 rounded-lg" }}
        />
        <span className="text-[#bdb29e]">–</span>
        <NumberInput
          size="xs"
          placeholder="Max ₹"
          min={0}
          value={priceRange.max || ""}
          onChange={(v) => setPriceRange({ ...priceRange, max: Number(v) || 500 })}
          classNames={{ input: "bg-[#222] border-[#2a2a2a] text-white w-24 rounded-lg" }}
        />
        <span className="text-xs text-[#bdb29e]">Price</span>
      </Box>}
      <Box className="flex items-center gap-2">
        <NumberInput
          size="xs"
          placeholder="Min m"
          min={0}
          value={clothRange.min || ""}
          onChange={(v) => setClothRange({ ...clothRange, min: Number(v) || 0 })}
          classNames={{ input: "bg-[#222] border-[#2a2a2a] text-white w-24 rounded-lg" }}
        />
        <span className="text-[#bdb29e]">–</span>
        <NumberInput
          size="xs"
          placeholder="Max m"
          min={0}
          value={clothRange.max === 10000 ? "" : clothRange.max}
          onChange={(v) => setClothRange({ ...clothRange, max: Number(v) || 10000 })}
          classNames={{ input: "bg-[#222] border-[#2a2a2a] text-white w-24 rounded-lg" }}
        />
        <span className="text-xs text-[#bdb29e]">Cloth avail.</span>
      </Box>
    </Box>
  );
}