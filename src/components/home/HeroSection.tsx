"use client";

import { Box, Title, Text, Button, Stack } from "@mantine/core";
import Image, { StaticImageData } from "next/image";

interface HeroSectionProps {
  eyebrow: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  backgroundImageUrl: string;
}

export function HeroSection({
  eyebrow,
  headline,
  description,
  ctaLabel,
  ctaHref = "#",
  backgroundImageUrl,
}: HeroSectionProps) {
  return (
    <Box
      className="relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden h-[60vh]"
    >
      <Box
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 11, 11, 0.3), rgba(11, 11, 11, 0.8)), url("${backgroundImageUrl}")`,
        }}
      />
      <Stack align="center" gap="md" className="relative z-10 max-w-4xl px-4 text-center">
        <Text
          size="xs"
          fw={700}
          className="mb-2 uppercase tracking-[0.2em] text-[#C5A059]"
        >
          {eyebrow}
        </Text>
        <Title order={1} className="font-serif text-5xl font-medium leading-tight tracking-tight text-white md:text-7xl">
          {headline}
        </Title>
        <Text size="lg" className="mx-auto max-w-xl font-light tracking-wide text-gray-300">
          {description}
        </Text>
        <Button
          component="a"
          href={ctaHref}
          variant="outline"
          color="gold"
          className="group mt-4 rounded-md border border-[#C5A059] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[#C5A059] transition-all duration-300 hover:bg-[#C5A059] hover:text-[#0B0B0B]"
        >
          <span className="flex items-center gap-2">
            {ctaLabel}
            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </span>
        </Button>
      </Stack>
    </Box>
  );
}