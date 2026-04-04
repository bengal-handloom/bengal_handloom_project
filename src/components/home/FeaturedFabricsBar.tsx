"use client";

import { Group, Title, Text, Box, UnstyledButton } from "@mantine/core";

interface FeaturedFabricsBarProps {
  title?: string;
  countLabel?: string;
  onFilter?: () => void;
  onSort?: () => void;
}

export function FeaturedFabricsBar({
  title = "Featured Fabrics",
  countLabel = "142 TEXTURES",
  onFilter,
  onSort,
}: FeaturedFabricsBarProps) {
  return (
    <Box className="sticky top-[73px] z-40 border-b border-[#2a2a2a] bg-[#0B0B0B]/95 shadow-2xl shadow-black/20 backdrop-blur-sm">
      <Group justify="space-between" wrap="wrap" className="mx-auto max-w-[1400px] gap-4 px-6 py-4">
        <Group gap="xs">
          <Title order={2} className="text-xl font-medium tracking-wide text-white">
            {title}
          </Title>
          <Text size="xs" className="mt-1 font-mono text-gray-500">
            {countLabel}
          </Text>
        </Group>
        <Group gap="md" className="text-sm text-gray-400">
          {onFilter && (
            <UnstyledButton
              onClick={onFilter}
              className="flex items-center gap-1 transition-colors hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filter
            </UnstyledButton>
          )}
          <span className="h-4 w-px bg-[#333]" />
          {onSort && (
            <UnstyledButton
              onClick={onSort}
              className="flex items-center gap-1 transition-colors hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">sort</span>
              Sort
            </UnstyledButton>
          )}
        </Group>
      </Group>
    </Box>
  );
}