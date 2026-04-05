import { create } from "zustand";
import type { ViewMode } from "@/types/wholesale";

interface CatalogState {
  searchQuery: string;
  /** Empty string = all regions */
  catalogRegion: string;
  /** Empty string = all locations */
  catalogLocation: string;
  viewMode: ViewMode;
  setSearchQuery: (q: string) => void;
  setCatalogRegion: (region: string) => void;
  setCatalogLocation: (location: string) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  searchQuery: "",
  catalogRegion: "",
  catalogLocation: "",
  viewMode: "grid",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCatalogRegion: (catalogRegion) => set({ catalogRegion, catalogLocation: "" }),
  setCatalogLocation: (catalogLocation) => set({ catalogLocation }),
  setViewMode: (viewMode) => set({ viewMode }),
}));