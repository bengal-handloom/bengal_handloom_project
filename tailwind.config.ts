import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // existing colors via CSS variables (optional to keep)
        light: "var(--light)",
        transparent: "transparent",
        dark: "var(--background-dark)",
        white: "var(--white)",
        black: "var(--black)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        success: "var(--success)",
        danger: "var(--danger)",
        gray: "var(--gray)",
        outline: "var(--outline)",
        darkgray: "var(--darkgray)",
        primary: "var(--primary)",

        // Digital Loom design tokens
        obsidian: {
          DEFAULT: "#0B0B0B", // background/base
          dim: "#121212",     // secondary surfaces
        },
        gold: {
          DEFAULT: "#C5A059", // primary/accent
          light: "#D4B468",
          dark: "#8C7335",
        },
        glass: {
          surface: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        // Inside theme.extend, add/ensure:

        "secondary-text": "var(--secondary-text)",  // Warm Taupe #9A9A9A
        "background-card": "#151515",                 // Login modal / dark cards
        "input-border": "#333333",
        "surface-dark": "#161616",


      },
      animation: {
        shuttle: "shuttle 3s ease-in-out infinite",
        "fade-slide-up": "fadeSlideUp 0.8s ease-out forwards",
      },
      keyframes: {
        shuttle: {
          "0%, 100%": { transform: "translateX(-20px)" },
          "50%": { transform: "translateX(20px)" },
        },
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      // Optional: spacing for section padding (use in pages)
      spacing: {
        "section-y": "5em",
        "section-x": "5%",
      },
      fontFamily: {
        // wired to next/font variables from layout.tsx
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],          // Inter
        serif: ["var(--font-playfair-display)", "Georgia", "serif"],     // Playfair Display
      },
      fontSize: {
        body: "var(--font-size-body)",
        heading: "var(--font-size-heading)",
        title: "var(--font-size-title)",
        headline: "var(--font-size-headline)",
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        md: "var(--font-size-md)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
      },
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};

export default config;