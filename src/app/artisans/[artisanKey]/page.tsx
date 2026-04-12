import { notFound } from "next/navigation";
import Link from "next/link";
import { Box, Text, Title } from "@mantine/core";
import { getArtisanByKey } from "@/data/artisans";

type PageProps = { params: Promise<{ artisanKey: string }> };

export default async function ArtisanHistoryPage({ params }: PageProps) {
  const { artisanKey } = await params;
  const artisan = getArtisanByKey(artisanKey);
  if (!artisan) notFound();

  return (
    <Box className="min-h-screen bg-[#0B0B0B] font-sans text-[#bdb29e]">
      {/* Top bar */}
      <Box className="sticky top-0 z-20 border-b border-[#2a2a2a] bg-[#0B0B0B]/85 backdrop-blur-md">
        <Box className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/catalog" className="text-xs uppercase tracking-widest text-white/60 hover:text-white">
            ← Back to catalog
          </Link>
          <Box className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#C5A059]">verified</span>
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Authenticated artisan history
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Hero */}
      <Box className="relative">
        <Box
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${artisan.heroImageUrl}')` }}
        />
        <Box className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-[#0B0B0B]" />

        <Box className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[340px_1fr] lg:px-8 lg:py-20">
          {/* Portrait */}
          <Box className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111] shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artisan.portraitImageUrl} alt="" className="h-full w-full object-cover" />
            {artisan.quote && (
              <Box className="absolute bottom-0 left-0 right-0 p-6">
                <Text className="font-serif text-lg italic text-white/70">“{artisan.quote}”</Text>
              </Box>
            )}
          </Box>

          {/* Copy */}
          <Box className="pt-2">
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              {artisan.seriesLabel}
            </Text>
            <Title order={1} className="mt-3 font-serif text-5xl font-normal leading-[1.05] text-white">
              The <span className="text-[#C5A059]">{artisan.name}</span> Legacy
            </Title>
            <Text className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
              {artisan.intro}
            </Text>

            <Box className="mt-7 flex flex-wrap gap-3">
              {artisan.metrics.map((yd) => (
                <Box key={yd.label} className="rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3">
                  <Text className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{yd.label}</Text>
                  <Text className="mt-1 text-sm font-semibold text-white">{yd.value}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Timeline */}
      <Box className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">
        <Box className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
          <Box className="space-y-10">
            {artisan.timeline.map((t) => (
              <Box key={t.year} className="relative rounded-2xl border border-[#2a2a2a] bg-[#101010] p-6">
                <Text className="text-3xl font-bold text-white/15">{t.year}</Text>
                <Title order={3} className="mt-1 text-xl font-semibold text-white">
                  {t.title}
                </Title>
                <Text className="mt-3 text-sm leading-relaxed text-white/55">{t.body}</Text>
              </Box>
            ))}
          </Box>

          {/* Craft card */}
          <Box className="h-fit rounded-2xl border border-[#2a2a2a] bg-[#101010] p-6">
            <Text className="text-xs font-semibold uppercase tracking-widest text-[#C5A059]">
              Craft
            </Text>
            <Title order={3} className="mt-3 text-xl font-semibold text-white">
              {artisan.craft.heading}
            </Title>
            <Box className="mt-4 space-y-3">
              {artisan.craft.bullets.map((b) => (
                <Box key={b} className="flex gap-3">
                  <span className="material-symbols-outlined mt-[2px] text-[#C5A059]">check_circle</span>
                  <Text className="text-sm text-white/60">{b}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}