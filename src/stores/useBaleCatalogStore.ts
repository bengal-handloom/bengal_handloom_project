"use client";

import { create } from "zustand";
import type { IndianStateFilter } from "@/types/wholesale";
import type { PriceRange, ClothAvailableRange } from "@/types/wholesale";

interface BaleCatalogState {
  stateFilter: IndianStateFilter;
  priceRange: PriceRange;
  clothAvailableRange: ClothAvailableRange;
  setStateFilter: (s: IndianStateFilter) => void;
  setPriceRange: (p: PriceRange) => void;
  setClothAvailableRange: (c: ClothAvailableRange) => void;
}

const defaultPrice: PriceRange = { min: 0, max: 500 };
const defaultCapacity: ClothAvailableRange = { min: 0, max: 10000 };

export const useBaleCatalogStore = create<BaleCatalogState>((set) => ({
  stateFilter: "All States",
  priceRange: defaultPrice,
  clothAvailableRange: defaultCapacity,
  setStateFilter: (stateFilter) => set({ stateFilter }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setClothAvailableRange: (clothAvailableRange) => set({ clothAvailableRange }),
}));