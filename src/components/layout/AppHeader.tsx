"use client";

import Link from "next/link";
import { Group, Button, Title, Box } from "@mantine/core";
import type { NavLinkItem } from "@/types/navigation";

interface AppHeaderProps {
  logo?: React.ReactNode;
  siteName: string;
  navItems?: NavLinkItem[];
  loginHref?: string;
  registerHref?: string;
}

export function AppHeader({
  logo,
  siteName,
  navItems = [],
  loginHref = "/login",
  registerHref = "/signup",
}: AppHeaderProps) {
  return (
    <Box
      component="header"
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2a2a] bg-[#0B0B0B]/90 backdrop-blur-md"
    >
      <Group justify="space-between" className="w-full px-6 py-4 lg:px-12" wrap="nowrap">
        <Group gap="md" wrap="nowrap">
          {logo}
          <Title order={2} className="text-lg font-bold tracking-tight text-white">
            {siteName}
          </Title>
        </Group>
        {navItems.length > 0 && (
          <Group gap="lg" className="hidden md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-[#C5A059]"
              >
                {item.label}
              </Link>
            ))}
          </Group>
        )}
        <Group gap="md">
          <Button
            component={Link}
            href={loginHref}
            variant="subtle"
            color="gold"
            className="hidden md:inline-flex text-sm font-bold hover:bg-transparent hover:text-white"
          >
            Login
          </Button>
          <Button
            component={Link}
            href={registerHref}
            color="gold"
            className="h-9 rounded-lg bg-[#C5A059] text-sm font-bold text-[#0B0B0B] hover:bg-white"
          >
            Register
          </Button>
        </Group>
      </Group>
    </Box>
  );
}