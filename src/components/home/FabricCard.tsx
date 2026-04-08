"use client";

import { Box, Title, Text, Card, Group } from "@mantine/core";
import type { Fabric } from "@/types/fabric";
import Link from "next/link";

interface FabricCardProps {
  fabric: Fabric;
}

export function FabricCard({ fabric }: FabricCardProps) {
  const badgeClass =
    fabric.badgeVariant === "gold"
      ? "bg-[#C5A059] text-[#0B0B0B]"
      : "bg-black/60 text-white border border-white/10 backdrop-blur-sm";

  return (
    <Box className="group flex flex-col gap-4">
      <Card
        padding={0}
        className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#161616] shadow-lg shadow-black/50"
      >
        <Box
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url("${fabric.imageUrl}")` }}
        />
        {fabric.badge && (
          <Box className="absolute top-3 right-3">
            <span
              className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
            >
              {fabric.badge}
            </span>
          </Box>
        )}
      </Card>
      <Box className="flex flex-col gap-2">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Title order={3} className="font-serif text-lg tracking-wide text-white transition-colors group-hover:text-[#C5A059]">
            {fabric.name}
          </Title>
          <Text size="xs" className="text-gray-500">
            {fabric.sku}
          </Text>
        </Group>
        {fabric.subHeader?.trim() ? (
          <Text size="sm" className="text-[#c4bdb0]">
            {fabric.subHeader.trim()}
          </Text>
        ) : null}
        <Group gap={6} wrap="wrap" className="text-[11px] uppercase tracking-wider text-gray-500">
          {fabric.region?.trim() ? <span>{fabric.region.trim()}</span> : null}
          {fabric.region?.trim() && fabric.location?.trim() ? <span aria-hidden>·</span> : null}
          {fabric.location?.trim() ? <span>{fabric.location.trim()}</span> : null}
        </Group>
        {fabric.gsm?.trim() ? (
          <Text size="xs" className="font-mono text-gray-400">
            {fabric.gsm.trim()} GSM
          </Text>
        ) : null}
        {/* {fabric.description?.trim() ? (
          <Text size="sm" lineClamp={2} className="leading-snug text-gray-400">
            {fabric.description.trim()}
          </Text>
        ) : null} */}

        {fabric.artisanKey && (
          <Link
            href={`/artisans/${fabric.artisanKey}`}
            className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] hover:underline"
          >
            Artisan history →
          </Link>
        )}
        <Box className="group/lock relative cursor-pointer overflow-hidden rounded border border-[#2a2a2a] bg-[#161616] p-3 transition-colors hover:border-[#C5A059]/30">
          <Group justify="space-between" className="opacity-30 blur-[2px]">
            <Text size="sm" className="font-mono text-white">
              {fabric.price} / yd
            </Text>
            <Text size="xs" className="text-gray-400">
              Min {fabric.minYards}
            </Text>
          </Group>
          <Box className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/40 backdrop-blur-[1px] transition-all group-hover/lock:bg-black/20">
            <span className="material-symbols-outlined text-sm text-[#C5A059]">lock</span>
            <Text size="xs" fw={700} className="uppercase tracking-wide text-[#C5A059]">
              Locked
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}