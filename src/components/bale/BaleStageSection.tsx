"use client";

import { Box } from "@mantine/core";
import { BaleStageStats } from "./BaleStageStats";
import { Bale3DCanvas } from "./Bale3DCanvas";
import { BaleStageActions } from "./BaleStageActions";

export function 
BaleStageSection() {
  return (
    <Box className="relative flex h-full min-h-[60vh] flex-col justify-between bg-[#0B0B0B] p-6 lg:p-8">
      <BaleStageStats />
      <Box className="absolute inset-0 flex items-center justify-center pt-24 pb-52 ">
        <Bale3DCanvas />
      </Box>
      <BaleStageActions />
    </Box>
  );
}