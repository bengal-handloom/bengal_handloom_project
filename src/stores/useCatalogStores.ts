import { create } from "zustand";
import type { OriginFilter, ViewMode } from "@/types/wholesale";

interface CatalogState {
  searchQuery: string;
  originFilter: OriginFilter;
  viewMode: ViewMode;
  setSearchQuery: (q: string) => void;
  setOriginFilter: (origin: OriginFilter) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  searchQuery: "",
  originFilter: "all",
  viewMode: "grid",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setOriginFilter: (originFilter) => set({ originFilter }),
  setViewMode: (viewMode) => set({ viewMode }),
}));