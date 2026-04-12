"use client";

import { useState } from "react";
import { Modal, NumberInput, Button, Text, Box } from "@mantine/core";
import type { FabricCatalogItem } from "@/types/fabricCatalog";

const STEP = 50;
const MIN_M = 50;

interface BaleCustomQuantityModalProps {
  fabric: FabricCatalogItem;
  opened: boolean;
  onClose: () => void;
  onAdd: (yards: number) => void;
}

export function BaleCustomQuantityModal({
  fabric,
  opened,
  onClose,
  onAdd,
}: BaleCustomQuantityModalProps) {
  const maxM = fabric.capacityLeft ?? fabric.availableYards;
  const [yards, setYards] = useState(MIN_M);

  const clamped = Math.min(maxM, Math.max(MIN_M, Math.round(yards / STEP) * STEP));
  const pieces = Math.floor(clamped / 50);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Order custom length — ${fabric.name}`}
      centered
      classNames={{
        content: "bg-[#1A1A1A] border border-[#2a2a2a]",
        header: "text-white border-b border-[#2a2a2a]",
        title: "text-lg font-bold",
        body: "pt-4",
      }}
    >
      <Box className="space-y-4">
        <Text size="sm" className="text-[#bdb29e]">
          Available: {maxM}yd. 1 cloth piece = 50yd.
        </Text>
        <NumberInput
          label="Yards"
          placeholder="e.g. 200"
          min={MIN_M}
          max={maxM}
          step={STEP}
          value={yards}
          onChange={(v) => setYards(Number(v) || MIN_M)}
          classNames={{
            input: "bg-[#222] border-[#2a2a2a] text-white rounded-lg",
          }}
        />
        <Text size="sm" className="text-[#bdb29e]">
          {clamped}yd → {pieces} cloth piece{pieces !== 1 ? "s" : ""} on the bale.
        </Text>
        <Button
          fullWidth
          className="rounded-lg bg-[#C5A059] font-bold text-black hover:bg-[#d4b468]"
          onClick={() => onAdd(clamped)}
        >
          Add {clamped}yd to bale
        </Button>
      </Box>
    </Modal>
  );
}