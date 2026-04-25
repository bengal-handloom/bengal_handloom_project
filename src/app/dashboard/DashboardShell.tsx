"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Group, Title } from "@mantine/core";
import type { ReactNode } from "react";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/catalog", label: "Catalog" },
  { href: "/bale", label: "Build Bale" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Box className="min-h-screen bg-[#0B0B0B] font-sans text-[#bdb29e] antialiased">
      <Box className="border-b border-[#2a2a2a] bg-[#0B0B0B]/90 backdrop-blur-md">
        <Group justify="space-between" className="mx-auto max-w-6xl px-6 py-4 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#C5A059]">texture</span>
            <Title order={2} className="text-lg font-semibold text-white">
              Heritage Artisan Loom
            </Title>
          </Link>
          <nav className="flex flex-wrap items-center gap-6">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-[#C5A059]" : "text-white/70 hover:text-[#C5A059]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Group>
      </Box>
      <Box className="mx-auto max-w-6xl px-6 py-10 lg:px-8">{children}</Box>
    </Box>
  );
}