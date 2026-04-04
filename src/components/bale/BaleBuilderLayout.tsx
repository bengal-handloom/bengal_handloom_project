"use client";

import { Box } from "@mantine/core";
import { BaleStageSection } from "./BaleStageSection";
import { BaleCatalogSection } from "./BaleCatalogSection";
import { BaleReviewModal } from "./BaleReviewModal";
import { useDisclosure } from "@mantine/hooks";
import { useBaleStore } from "@/stores/useBaleStore";

export function BaleBuilderLayout() {
  const {baleReviewModalDisclosure, reviewModalOpen} = useBaleStore((s)=>s)
  return (
    <Box component="main" className="relative  overflow-hidden lg:flex-row">
      <BaleReviewModal opened={reviewModalOpen} onClose={()=>baleReviewModalDisclosure(false)} />

      <Box className="w-[40%] border-r border-[#2a2a2a]  h-[95vh] fixed">
        <BaleStageSection />
      </Box>
      <Box className="flex justify-end w-full  overflow-hidden ">
        <Box className="w-[60%]">
          <BaleCatalogSection />

        </Box>
      </Box>
    </Box>
  );
}