import { Box } from "@mantine/core";
import { AppHeader } from "@/components/layout/AppHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { LoadingMore } from "@/components/home/LoadingMore";
import { CTASection } from "@/components/home/CTASection";
import { FloatingBar } from "@/components/home/FloatingBar";
import { DEFAULT_NAV_ITEMS } from "@/data/navigation";
import { HomeCatalogSection } from "@/components/home/HomeCatalogSection";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC_nxCNaMhd9AYNGq-Ib6fYjov5Iqhx7LY4B0z9qfyhPXXn0ospSnHdpW_oHMy0oS8Fk1lCya9CDH1KJZ1FU651WqMgxjBdeXrIY8zquy7vI8_r9gYlhXqFdavTne_MuWvo02_DJgnouVWfiNGwkLrb4cx54X28YrRX-xV5x-LmYZctGwSUqmRHIGG6HzzpDvxh5aI_0JklkV1-ljUytILQPxEm1Ci-DfkmBpVjztiNPald1GoIa3KXmRGaipY-Pq4kcUEwVh6GREPA";

const CTA_BG_IMAGE =
  "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2832&auto=format&fit=crop";

export default function Home() {
  return (
    <Box className="relative flex min-h-screen flex-col bg-[#0B0B0B] pb-24 font-sans text-white antialiased selection:bg-[#C5A059]/30">
      <AppHeader
        logo={
          <span className="material-symbols-outlined size-6 text-2xl text-[#C5A059]">
            texture
          </span>
        }
        siteName="The Digital Loom"
        navItems={DEFAULT_NAV_ITEMS}
      />

      <Box component="main" className="grow pt-20">
        <HeroSection
          eyebrow="Exclusive Wholesale Access"
          headline="2026 Heritage Collection"
          description="Exquisite weaves for the modern atelier. Discover textures that define the next generation of luxury."
          ctaLabel="Request Access"
          backgroundImageUrl={HERO_IMAGE}
        />

        <HomeCatalogSection />

        <LoadingMore />

        <CTASection
          title="Join The Digital Loom"
          description="You've reached the end of the public preview. To browse our full catalog of 500+ premium textiles and view wholesale pricing, please apply for partner access."
          buttonLabel="Apply for Membership"
          disclaimer="Requires Valid EIN / Tax ID."
          backgroundImageUrl={CTA_BG_IMAGE}
        />
      </Box>

      <FloatingBar message="Pricing Locked" actionLabel="Login to Access" />
    </Box>
  );
}