"use client";

import Link from "next/link";
import { Box, Button, Text, Title } from "@mantine/core";
import type { OrderDTO, OrderStatus } from "@/types/order";

const ARTISAN_IMG_FALLBACK =
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80";

function stepMeta(status: OrderStatus): {
  s1: "done" | "active" | "pending";
  s2: "done" | "active" | "pending";
  s3: "done" | "active" | "pending";
} {
  if (status === "cancelled") {
    return { s1: "done", s2: "pending", s3: "pending" };
  }
  if (status === "admin_review") {
    return { s1: "done", s2: "active", s3: "pending" };
  }
  if (status === "loom_allocation") {
    return { s1: "done", s2: "done", s3: "active" };
  }
  if (status === "in_production" || status === "shipped" || status === "completed") {
    return { s1: "done", s2: "done", s3: "done" };
  }
  return { s1: "done", s2: "active", s3: "pending" };
}

function StepConnector({ tone }: { tone: "gold" | "muted" }) {
  return (
    <Box
      className="mx-auto mt-1 min-h-[44px] w-px flex-1"
      style={{
        backgroundColor: tone === "gold" ? "#C5A059" : "rgba(255,255,255,0.12)",
      }}
    />
  );
}

function StepRow({
  title,
  subtitle,
  state,
  showConnector,
  connectorTone,
  activeDetail,
}: {
  title: string;
  subtitle: string;
  state: "done" | "active" | "pending";
  showConnector: boolean;
  connectorTone: "gold" | "muted";
  activeDetail?: React.ReactNode;
}) {
  const circle =
    state === "done" ? (
      <Box className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#C5A059] text-black">
        <span className="material-symbols-outlined text-xl">check</span>
      </Box>
    ) : state === "active" ? (
      <Box className="relative flex size-10 shrink-0 items-center justify-center">
        <Box className="absolute size-10 rounded-full border-2 border-[#C5A059]/70" />
        <Box className="size-3 rounded-full bg-[#C5A059]" />
      </Box>
    ) : (
      <Box className="size-10 shrink-0 rounded-full border-2 border-white/18" />
    );

  return (
    <Box className="relative flex gap-5">
      <Box className="flex flex-col items-center">
        {circle}
        {showConnector && <StepConnector tone={connectorTone} />}
      </Box>
      <Box className="min-w-0 flex-1 pb-10">
        <Text
          className={`text-base font-semibold ${
            state === "active" ? "text-[#C5A059]" : state === "done" ? "text-white" : "text-white/38"
          }`}
        >
          {title}
        </Text>
        <Box className="mt-1 flex flex-wrap items-center gap-2">
          {state === "active" && activeDetail}
          <Text size="sm" className="text-white/45">
            {subtitle}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export function OrderSuccessView({ order }: { order: OrderDTO }) {
  const meta = stepMeta(order.status);
  const artisan = order.assignedArtisan;

  const createdAtLabel = order.createdAt
    ? new Date(order.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  const s1Sub = meta.s1 === "done" ? `Completed — ${createdAtLabel}` : "Awaiting submission";

  let s2Sub = "Pending";
  if (meta.s2 === "active") s2Sub = "Est. 2 hrs";
  else if (meta.s2 === "done") s2Sub = "Completed";

  let s3Sub = "Pending availability";
  if (meta.s3 === "active") s3Sub = "Matching capacity to your bale";
  else if (meta.s3 === "done") s3Sub = "Loom reserved";

  const imgSrc = artisan?.imageUrl?.trim() ? artisan.imageUrl : ARTISAN_IMG_FALLBACK;

  return (
    <Box className="relative overflow-hidden rounded-2xl">
      <Box
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -12deg,
            transparent,
            transparent 12px,
            rgba(197,160,89,0.35) 12px,
            rgba(197,160,89,0.35) 13px
          )`,
        }}
      />

      <Box className="relative grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14 xl:gap-20">
        <Box>
          <Title
            order={1}
            className="font-serif text-[2.75rem] font-normal leading-[1.1] tracking-tight text-white md:text-5xl"
          >
            The Loom
            <br />
            <span className="text-[#C5A059]">is Calling</span>
          </Title>

          <Box className="my-8 flex items-center gap-4">
            <Box className="h-px w-20 bg-[#C5A059]" />
            <Text className="text-base text-white/90">
              Order{" "}
              <Text component="span" className="font-medium text-[#C5A059]">
                #{order.orderNumber}
              </Text>{" "}
              confirmed.
            </Text>
          </Box>

          {order.status === "cancelled" && (
            <Text className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
              This request was cancelled.
            </Text>
          )}

          <Box className="max-w-lg">
            <StepRow
              title="Request Submitted"
              subtitle={s1Sub}
              state={meta.s1}
              showConnector
              connectorTone={meta.s1 === "done" ? "gold" : "muted"}
            />
            <StepRow
              title="Admin Review"
              subtitle={s2Sub}
              state={meta.s2}
              showConnector
              connectorTone={meta.s2 === "done" ? "gold" : "muted"}
              activeDetail={
                meta.s2 === "active" ? (
                  <span className="material-symbols-outlined inline-block animate-spin text-lg text-[#C5A059]">
                    progress_activity
                  </span>
                ) : null
              }
            />
            <StepRow
              title="Loom Allocation"
              subtitle={s3Sub}
              state={meta.s3}
              showConnector={false}
              connectorTone="muted"
            />
          </Box>

          <Box className="mt-4 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              component="button"
              type="button"
              disabled
              classNames={{
                root: "h-12 rounded-lg bg-[#C5A059] px-6 font-bold uppercase tracking-wider text-black hover:bg-[#d4b468] disabled:opacity-40",
              }}
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">download</span>
              Download invoice
            </Button>
            <Button
              component={Link}
              href="/catalog"
              variant="outline"
              classNames={{
                root: "h-12 rounded-lg border-white/35 uppercase tracking-wider text-white hover:bg-white/5",
              }}
            >
              Return to catalog
            </Button>
          </Box>
        </Box>

        <Box>
          <Box className="mb-4 flex items-start justify-between gap-4">
            <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              {artisan?.title ?? "Assigned artisan"}
            </Text>
            <span className="material-symbols-outlined shrink-0 text-[#C5A059]" title="Verified">
              verified
            </span>
          </Box>

          <Box className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#121212] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <Box className="relative aspect-[5/4] w-full bg-[#0a0a0a] sm:aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = ARTISAN_IMG_FALLBACK;
                }}
              />
              <Box className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              {artisan?.badge ? (
                <Box className="absolute bottom-5 left-5 rounded-sm bg-[#C5A059] px-3 py-2 shadow-lg">
                  <Text className="text-[11px] font-bold uppercase tracking-widest text-black">
                    {artisan.badge}
                  </Text>
                </Box>
              ) : null}
            </Box>

            <Box className="border-t border-[#2a2a2a] p-6 md:p-8">
              <Title order={3} className="font-serif text-2xl font-normal text-white md:text-3xl">
                {artisan?.name ?? "Your artisan"}
              </Title>
              <Text className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
                {artisan?.bio ??
                  "Your fabric will be personally hand-inspected before shipment to ensure zero imperfections."}
              </Text>
              <Text className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-[#C5A059]">
                Read their story →
              </Text>
            </Box>
          </Box>

          {artisan?.quote ? (
            <Text className="mt-8 max-w-md font-serif text-lg italic leading-relaxed text-white/30">
              {artisan.quote}
            </Text>
          ) : null}
        </Box>
      </Box>

      <Box className="relative mt-12 border-t border-[#2a2a2a] pt-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#C5A059] transition-colors hover:text-[#e4c77a]"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to dashboard
        </Link>
      </Box>
    </Box>
  );
}