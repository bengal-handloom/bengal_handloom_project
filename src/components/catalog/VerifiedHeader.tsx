"use client";

import Link from "next/link";
import { Group, Title, Box, TextInput, UnstyledButton } from "@mantine/core";
import type { NavLinkItem } from "@/types/navigation";
import { useCatalogStore } from "@/stores/useCatalogStores";

interface VerifiedHeaderProps {
  logo?: React.ReactNode;
  siteName: string;
  navItems: NavLinkItem[];
  profileImageUrl?: string;
}

export function VerifiedHeader({
  logo,
  siteName,
  navItems,
  profileImageUrl,
}: VerifiedHeaderProps) {
  const searchQuery = useCatalogStore((s) => s.searchQuery);
  const setSearchQuery = useCatalogStore((s) => s.setSearchQuery);

  return (
    <Box
      component="header"
      className="sticky top-0 z-50 w-full border-b border-[#2a2a2a] bg-[#0B0B0B]/85 backdrop-blur-md"
    >
      <Group justify="space-between" className="h-16 px-6 lg:px-12" wrap="nowrap">
        <Group gap="lg" wrap="nowrap">
          <Group gap="xs" className="text-white">
            {logo}
            <Title order={1} className="text-xl font-bold tracking-tight text-white">
              {siteName}
            </Title>
          </Group>
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white transition-colors hover:text-[#C5A059]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Group>
        <Group gap="lg">
          <Group gap="xs">
            <UnstyledButton
              className="h-9 w-9 rounded-full border border-[#2a2a2a] bg-cover bg-center"
              style={{ backgroundImage: profileImageUrl ? `url('${profileImageUrl}')` : undefined }}
            >
              {!profileImageUrl && <span className="text-xs text-white">?</span>}
            </UnstyledButton>
          </Group>
        </Group>
      </Group>
    </Box>
  );
}