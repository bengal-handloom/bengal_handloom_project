import { create } from "zustand";
import type { BaleLine } from "@/types/wholesale";
import type { FabricCatalogItem } from "@/types/fabricCatalog";
import { YARDS_PER_PIECE, PER_FABRIC_BALE_CAPACITY_M } from "@/constants/bale";


function capacityLeft(f: FabricCatalogItem): number {
  return f.capacityLeft ?? f.availableYards;
}

function generateLineId(fabricId: string, index: number): string {
  return `${fabricId}-${index}`;
}

interface BaleState {
  lines: BaleLine[];
  reviewModalOpen: boolean;
  baleReviewModalDisclosure: (isOpen: boolean) => void;
  addToBale: (fabric: FabricCatalogItem, yards: number) => void;
  removeFromBale: (lineId: string) => void;
  clearBale: () => void;
  totalYards: () => number;
  totalPieces: () => number;
  estimatedValue: () => number;
  lastAddedLineId: string | null;
  setLastAddedLineId: (id: string | null) => void;
}

export const useBaleStore = create<BaleState>((set, get) => ({
  lines: [],
  lastAddedLineId: null,
  reviewModalOpen: false,
  baleReviewModalDisclosure:(isOpen)=>{
    set({
      reviewModalOpen: isOpen
    })
  },

  addToBale: (fabric, yards) => {
    if (fabric.pricingVisible === false) return;
    const cap = capacityLeft(fabric);
    const state = get();
    const alreadyForFabric = state.lines
      .filter((l) => l.fabric.id === fabric.id)
      .reduce((sum, l) => sum + l.yards, 0);
    const roomInBale = Math.max(0, PER_FABRIC_BALE_CAPACITY_M - alreadyForFabric);
    const clamped = Math.min(yards, cap, roomInBale);
    if (clamped < 50) return;
    const sameFabricCount = state.lines.filter((l) => l.fabric.id === fabric.id).length;
    const lineId = generateLineId(fabric.id, sameFabricCount);
    const line: BaleLine = { lineId, fabric, yards: clamped };
    set({
      lines: [...state.lines, line],
      lastAddedLineId: lineId,
    });
  },

  removeFromBale: (lineId) =>
    set((state) => ({
      lines: state.lines.filter((l) => l.lineId !== lineId),
      lastAddedLineId: state.lastAddedLineId === lineId ? null : state.lastAddedLineId,
    })),

  clearBale: () => set({ lines: [], lastAddedLineId: null }),

  totalYards: () => get().lines.reduce((sum, l) => sum + l.yards, 0),
  totalPieces: () => Math.floor(get().totalYards() / YARDS_PER_PIECE),
  estimatedValue: () =>
    get().lines.reduce((sum, l) => {
      if (l.fabric.pricingVisible === false) return sum;
      return sum + l.fabric.pricePerYard * l.yards;
    }, 0),

  setLastAddedLineId: (id) => set({ lastAddedLineId: id }),
}));
