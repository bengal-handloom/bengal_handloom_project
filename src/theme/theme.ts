import { createTheme } from "@mantine/core";

const OBSIDIAN = "#0B0B0B";
const GOLD = "#C5A059";
const SURFACE_DARK = "#161616";

export const digitalLoomTheme = createTheme({
  primaryColor: "gold",
  colors: {
    gold: [
      "#f8f4ec",
      "#ebe2d0",
      "#d4b468",
      "#c5a059",
      "#a07e3a",
      GOLD,
      "#8c7335",
      "#6b5729",
      "#4a3d1c",
      "#2a2312",
    ],
    dark: [
      "#e6e6e6",
      "#2a2a2a",
      "#1a1a1a",
      "#161616",
      SURFACE_DARK,
      "#121212",
      "#0f0f0f",
      OBSIDIAN,
      "#080808",
      "#000000",
    ],
  },
  defaultRadius: "md",
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  headings: {
    fontFamily: "var(--font-playfair-display), Georgia, serif",
  },
  other: {
    obsidian: OBSIDIAN,
    gold: GOLD,
    surfaceDark: SURFACE_DARK,
  },
});