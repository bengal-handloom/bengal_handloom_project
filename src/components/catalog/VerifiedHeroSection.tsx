"use client";

import { Box, Title, Text } from "@mantine/core";

interface VerifiedHeroSectionProps {
  eyebrow: string;
  headline: string;
  subtitle: string;
  backgroundImageUrl: string;
}

export function VerifiedHeroSection({
  eyebrow,
  headline,
  subtitle,
  backgroundImageUrl,
}: VerifiedHeroSectionProps) {
  return (
    <Box
      className="relative flex h-[450px] w-full items-center justify-center overflow-hidden bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${backgroundImageUrl}')`,
      }}
    >
      <Box className="relative z-10 max-w-2xl border border-[#C5A059]/40 bg-black/30 p-10 text-center backdrop-blur-sm">
        <Text size="sm" fw={500} className="mb-4 uppercase tracking-[0.2em] text-[#C5A059]">
          {eyebrow}
        </Text>
        <Title order={2} className="font-serif text-5xl italic text-white mb-2 md:text-6xl">
          {headline}
        </Title>
        <Text className="mt-4 font-light text-gray-300">{subtitle}</Text>
      </Box>
    </Box>
  );
}