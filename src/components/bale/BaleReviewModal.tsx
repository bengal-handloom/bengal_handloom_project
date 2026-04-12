"use client";

import { Box, Button, Text, Alert } from "@mantine/core";
import { useBaleStore } from "@/stores/useBaleStore";
import type { BaleLine } from "@/types/wholesale";
import { formatCatalogPricePerYard } from "@/lib/mapFabricCatalogItem";
import { useRouter } from "next/navigation";
import { useState } from "react";

function getLineSubtotal(line: BaleLine): number {
  if (line.fabric.pricingVisible === false) return 0;
  return line.fabric.pricePerYard * line.yards;
}

const IMPACT_GREEN = "#3D5A4C";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

interface BaleReviewModalProps {
  opened: boolean;
  onClose: () => void;
}

export function BaleReviewModal({ opened, onClose }: BaleReviewModalProps) {
  const router = useRouter();

  const lines = useBaleStore((s) => s.lines);
  const estimatedValue = useBaleStore((s) => s.estimatedValue());
  const totalYards = useBaleStore((s) => s.totalYards());

  const clearBale = useBaleStore((s) => s.clearBale);
  const baleReviewModalDisclosure = useBaleStore(
    (s) => s.baleReviewModalDisclosure
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmitBooking() {
    setSubmitError(null);

    if (lines.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((line) => ({
            fabricId: line.fabric.id,
            name: line.fabric.name,
            yards: line.yards,
            pricePerYard: line.fabric.pricePerYard,
            imageSmallUrl: line.fabric.imageSmallUrl,
            imageLargeUrl: line.fabric.imageLargeUrl,
            subtotal: getLineSubtotal(line),
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.push("/login?next=/bale");
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Could not submit order");
      }

      if (!data?.id || typeof data.id !== "string") {
        throw new Error("Order created, but backend returned no order id.");
      }

      // Reset bale + close modal
      clearBale();
      baleReviewModalDisclosure(false);
      onClose();

      // Show success screen in My Dashboard
      router.push(`/dashboard/orders/${data.id}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // snapshot
  const snapshotImage =
    lines.length > 0
      ? lines[0].fabric.imageSmallUrl || lines[0].fabric.imageLargeUrl
      : undefined;

  if (!opened) return null;

  return (
    <Box
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bale-review-title"
    >
      {/* Backdrop */}
      <Box
        className="absolute inset-0 bg-[#0B0B0B]/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      {/* Radial glow behind modal */}
      <Box
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C5A059]/5 blur-[100px]"
        aria-hidden
      />

      {/* Modal panel */}
      <Box
        className="relative z-10 flex min-h-[600px] w-full max-w-[1280px] flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1A1A1A] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_80px_-20px_rgba(197,160,89,0.15)] lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Visual snapshot */}
        <Box className="relative w-full border-b border-[#2a2a2a] bg-black/20 lg:w-[35%] lg:border-b-0 lg:border-r">
          <Box className="flex aspect-[4/5] max-h-[500px] w-full items-center justify-center p-6">
            <Box
              className="relative w-full overflow-hidden rounded-xl shadow-2xl"
              style={{ aspectRatio: "4/5" }}
            >
              {snapshotImage ? (
                <>
                  <Box
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${snapshotImage})` }}
                  />
                  <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </>
              ) : (
                <Box className="flex h-full w-full items-center justify-center bg-[#151515]">
                  <span className="material-symbols-outlined text-6xl text-[#C5A059]/50">
                    view_in_ar
                  </span>
                </Box>
              )}

              <Box className="absolute bottom-0 left-0 right-0 p-6">
                <Box className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-md">
                  <span className="material-symbols-outlined text-base text-[#C5A059]">
                    view_in_ar
                  </span>
                  <span className="text-xs font-medium tracking-wide text-white/90">
                    Visual Snapshot
                  </span>
                </Box>

                <Text className="text-xl font-semibold leading-tight text-white">
                  {lines.length > 0 ? lines[0].fabric.name : "Bale preview"}
                </Text>

                <Text size="sm" className="mt-1 text-white/60">
                  {lines.length} fabric{lines.length !== 1 ? "s" : ""} ·{" "}
                  {totalYards.toFixed(0)}yd total
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right: Content */}
        <Box className="flex flex-1 flex-col p-6 lg:p-10">
          {/* Header */}
          <Box className="mb-8 flex items-start justify-between">
            <Box>
              <Text
                id="bale-review-title"
                className="font-bold tracking-tight text-white text-3xl lg:text-4xl"
              >
                Bale Review
              </Text>

              <Box className="mt-1 flex items-center gap-2 text-sm uppercase tracking-wide text-white/40">
                <span>Booking Request</span>
                <span className="h-1 w-1 rounded-full bg-[#C5A059]/50" />
                <span>Summary</span>
              </Box>
            </Box>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </Box>

          {/* Scrollable content */}
          <Box className="-mr-2 flex flex-1 flex-col gap-8 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/[0.02] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb:hover]:bg-white/20">
            {/* Fabric table */}
            <Box className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-white/[0.02]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#2a2a2a] bg-white/[0.02]">
                    <th className="w-1/3 px-5 py-3 text-xs font-medium uppercase tracking-wider text-white/40">
                      Fabric Name
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">
                      Qty
                    </th>
                    <th className="hidden px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/40 sm:table-cell">
                      Unit Price
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {lines.map((line) => {
                    const subtotal = getLineSubtotal(line);
                    return (
                      <tr
                        key={line.lineId}
                        className="border-b border-[#2a2a2a]/50 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4">
                          <Text className="font-medium text-white">
                            {line.fabric.name}
                          </Text>
                          <Text size="xs" className="sm:hidden text-white/40">
                            {formatCatalogPricePerYard(line.fabric)}/yd
                          </Text>
                        </td>

                        <td className="px-5 py-4 text-right text-white/70">
                          {line.yards}yd
                        </td>

                        <td className="hidden px-5 py-4 text-right text-white/70 sm:table-cell">
                          {formatCatalogPricePerYard(line.fabric)}
                        </td>

                        <td className="px-5 py-4 text-right font-medium text-white">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>

            {/* Social Impact */}
            <Box className="space-y-3">
              <Box className="mb-2 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ color: IMPACT_GREEN }}
                >
                  eco
                </span>
                <Text className="text-sm font-semibold uppercase tracking-widest text-white/60">
                  Social Impact
                </Text>
              </Box>

              <Box className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Box
                  className="group flex flex-col gap-1 rounded-xl border p-4 transition-colors"
                  style={{
                    backgroundColor: `${IMPACT_GREEN}1A`,
                    borderColor: `${IMPACT_GREEN}33`,
                  }}
                >
                  <Box className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: `${IMPACT_GREEN}CC` }}
                    >
                      Fair Wages
                    </span>
                    <span className="material-symbols-outlined text-[#C5A059] text-[20px] opacity-80 transition-transform group-hover:scale-110">
                      payments
                    </span>
                  </Box>
                  <Box className="mt-2">
                    <span className="text-2xl font-bold text-white">320</span>
                    <span className="ml-1 text-sm text-white/50">Days</span>
                  </Box>
                  <Text size="xs" className="text-white/40">
                    Direct artisan payments
                  </Text>
                </Box>

                <Box
                  className="group flex flex-col gap-1 rounded-xl border p-4 transition-colors"
                  style={{
                    backgroundColor: `${IMPACT_GREEN}1A`,
                    borderColor: `${IMPACT_GREEN}33`,
                  }}
                >
                  <Box className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: `${IMPACT_GREEN}CC` }}
                    >
                      Families
                    </span>
                    <span className="material-symbols-outlined text-[#C5A059] text-[20px] opacity-80 transition-transform group-hover:scale-110">
                      diversity_3
                    </span>
                  </Box>
                  <Box className="mt-2">
                    <span className="text-2xl font-bold text-white">6</span>
                    <span className="ml-1 text-sm text-white/50">
                      Households
                    </span>
                  </Box>
                  <Text size="xs" className="text-white/40">
                    Supported this month
                  </Text>
                </Box>

                <Box
                  className="group flex flex-col gap-1 rounded-xl border p-4 transition-colors"
                  style={{
                    backgroundColor: `${IMPACT_GREEN}1A`,
                    borderColor: `${IMPACT_GREEN}33`,
                  }}
                >
                  <Box className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: `${IMPACT_GREEN}CC` }}
                    >
                      Purity
                    </span>
                    <span className="material-symbols-outlined text-[#C5A059] text-[20px] opacity-80 transition-transform group-hover:scale-110">
                      water_drop
                    </span>
                  </Box>
                  <Box className="mt-2">
                    <span className="text-2xl font-bold text-white">100%</span>
                    <span className="ml-1 text-sm text-white/50">Natural</span>
                  </Box>
                  <Text size="xs" className="text-white/40">
                    Chemical-free dyes
                  </Text>
                </Box>
              </Box>
            </Box>

            {submitError && (
              <Alert color="red" variant="light" className="mb-4">
                {submitError}
              </Alert>
            )}
          </Box>

          {/* Footer CTA */}
          <Box className="mt-2 flex flex-col items-center justify-between gap-6 border-t border-[#2a2a2a] pt-8 sm:flex-row">
            <Box className="flex flex-col items-center sm:items-start">
              <Text size="xs" className="mb-1 font-medium uppercase tracking-wider text-white/50">
                Total Estimate
              </Text>
              <Text className="font-bold tracking-tight text-[#C5A059] text-3xl md:text-4xl">
                {formatCurrency(estimatedValue)}
              </Text>
            </Box>

            <Button
              className="relative h-auto w-full overflow-hidden rounded-lg bg-[#C5A059] px-8 py-4 text-lg font-medium text-black shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-300 hover:bg-[#C5A059] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] sm:w-auto disabled:opacity-50"
              onClick={handleSubmitBooking}
              loading={submitting}
              disabled={lines.length === 0 || submitting}
            >
              <Box className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative flex items-center justify-center gap-2">
                Submit Booking Request
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </span>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}