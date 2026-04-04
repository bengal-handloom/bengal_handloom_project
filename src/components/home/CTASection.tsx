"use client";

import { Box, Title, Text, Button, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";

interface CTASectionProps {
  title: string;
  description: string;
  buttonLabel: string;
  disclaimer?: string;
  backgroundImageUrl?: string;
}

export function CTASection({
  title,
  description,
  buttonLabel,
  disclaimer,
  backgroundImageUrl,
}: CTASectionProps) {
  const router = useRouter()
  return (
    <Box className="relative mt-12 overflow-hidden border-t border-[#1a1a1a] py-32 px-6">
      {backgroundImageUrl && (
        <Box
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
      )}
      <Box className="glass-panel relative mx-auto max-w-3xl rounded-2xl border-t border-[#C5A059]/20 p-10 text-center md:p-14">
        <Box className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-[#C5A059] p-3 shadow-lg shadow-[#C5A059]/20 text-[#0B0B0B]">
          <span className="material-symbols-outlined text-3xl">verified_user</span>
        </Box>
        <Stack align="center" gap="md" className="mt-4">
          <Title order={2} className="font-serif text-3xl font-medium text-white md:text-4xl">
            {title}
          </Title>
          <Text size="lg" className="mx-auto mb-8 max-w-lg leading-relaxed text-gray-300">
            {description}
          </Text>
          <Button
            onClick={(e)=>{
              e.preventDefault()
              router.push("/signup")
            }}
            color="gold"
            className="w-full rounded-lg bg-[#C5A059] px-10 py-4 text-sm font-bold uppercase tracking-wide text-[#0B0B0B] shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:bg-white sm:w-auto"
          >
            {buttonLabel}
          </Button>
          {disclaimer && (
            <Text size="xs" className="mt-6 text-gray-500">
              {disclaimer}
            </Text>
          )}
        </Stack>
      </Box>
    </Box>
  );
}