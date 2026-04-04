import { Box } from "@mantine/core";
import { VerifiedHeader } from "@/components/catalog/VerifiedHeader";
import { VerifiedHeroSection } from "@/components/catalog/VerifiedHeroSection";
import { BaleFloatingBar } from "@/components/catalog/BaleFloatingBar";
import { VERIFIED_NAV_ITEMS } from "@/data/verifiedNav";
import { VERIFIED_HERO_IMAGE } from "@/data/wholeSaleFabric";
import { CatalogClientSection } from "@/components/catalog/CatalogClientCatalogSection";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCNIH-MWRYBI2sO5s41kK_EVUoOI_9jFW3XPQrTeLEnohw1BETES228GcY8LlG3Z7pQ0mRaB2m0ixLoYXdcg_m6I0bPycVqKfp2vpV2y3tuxDkEipaViHX2eEqqBjs7jy4hkh6jjYhiNCRW77lgrNlNake3S4PSW9zyRbmZRVpYmcm4SaOxVPbYuWAG--9OFOtDPPGxgxT9sBbyO0tMLSX9Cqg2OdFXaLAYfa-1b3u73vc8kIozpVTWQCYdN3zrBU4Bn6iZeVJFq27i";

export default function CatalogPage() {
  return (
    <Box className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#0B0B0B] font-sans text-[#bdb29e] antialiased selection:bg-[#C5A059] selection:text-black">
      <VerifiedHeader
        logo={<span className="material-symbols-outlined text-3xl text-[#C5A059]">texture</span>}
        siteName="The Digital Loom"
        navItems={VERIFIED_NAV_ITEMS}
        profileImageUrl={PROFILE_IMAGE}
      />

      <Box component="main" className="flex-1 pb-32">
        <VerifiedHeroSection
          eyebrow="Wholesale Exclusive"
          headline="2026 Heritage Collection"
          subtitle="Curated artisanal weaves for the modern atelier."
          backgroundImageUrl={VERIFIED_HERO_IMAGE}
        />

        <CatalogClientSection />
      </Box>

      <BaleFloatingBar />
    </Box>
  );
}