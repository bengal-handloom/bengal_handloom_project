"use client";

import { Box, Group } from "@mantine/core";

const TOTAL_STEPS = 3;

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <Group gap={0} justify="center" className="mb-8 w-full">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = i + 1;
        const isActive = currentStep === step;
        return (
          <Box key={step} className="flex items-center">
            <Box
              className={`flex h-8 w-8 flex-shrink-0 cursor-default items-center justify-center rounded-full border text-xs font-bold font-sans ${
                isActive
                  ? "border-[#C5A059] bg-[#C5A059]/20 text-[#C5A059] shadow-[0_0_15px_rgba(194,163,91,0.2)]"
                  : "border-white/30 bg-transparent text-white/50 opacity-40"
              }`}
            >
              {step}
            </Box>
            {i < TOTAL_STEPS - 1 && (
              <Box className="h-px w-16 flex-shrink-0 bg-white/10" aria-hidden />
            )}
          </Box>
        );
      })}
    </Group>
  );
}