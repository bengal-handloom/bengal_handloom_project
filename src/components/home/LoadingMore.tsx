"use client";

import { Box, Text } from "@mantine/core";

interface LoadingMoreProps {
  label?: string;
}

export function LoadingMore({ label = "Loading more textures..." }: LoadingMoreProps) {
  return (
    <Box className="flex w-full flex-col items-center justify-center gap-4 pt-24 pb-8 opacity-80">
      <Box className="relative flex h-12 w-24 items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-[#C5A059] animate-shuttle drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">
          swap_horiz
        </span>
      </Box>
      <Text
        size="xs"
        fw={500}
        className="animate-pulse uppercase tracking-[0.25em] text-[#C5A059]/70"
      >
        {label}
      </Text>
    </Box>
  );
}