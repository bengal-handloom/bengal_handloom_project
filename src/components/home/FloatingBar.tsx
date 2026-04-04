"use client";

import { Group, Button, Text, Box } from "@mantine/core";

interface FloatingBarProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function FloatingBar({
  message = "Pricing Locked",
  actionLabel = "Request Access",
  onAction,
}: FloatingBarProps) {
  return (
    <Box className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-lg -translate-x-1/2 transition-transform duration-500">
      <Box className="glass-panel flex items-center justify-between rounded-full border border-white/10 p-2 pl-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] ring-1 ring-black/50">
        <Group gap="sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C5A059] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C5A059]" />
          </span>
          <Text size="sm" fw={500} className="tracking-wide text-gray-200">
            {message}
          </Text>
        </Group>
        <Button
          variant="filled"
          color="gray"
          className="rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#C5A059] hover:text-black"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </Box>
    </Box>
  );
}