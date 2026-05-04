import { Box } from "@mantine/core";
import { AppHeader } from "@/components/layout/AppHeader";
import { VerifiedHeader } from "@/components/catalog/VerifiedHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { LoadingMore } from "@/components/home/LoadingMore";
import { CTASection } from "@/components/home/CTASection";
import { FloatingBar } from "@/components/home/FloatingBar";
import { DEFAULT_NAV_ITEMS } from "@/data/navigation";
import { VERIFIED_NAV_ITEMS } from "@/data/verifiedNav"; // keep exact filename casing
import { HomeCatalogSection } from "@/components/home/HomeCatalogSection";
import { getOptionalVerifiedSession } from "@/lib/getOptionalSession";


const BG_IMAGE = "https://digital-loom.s3.ap-south-1.amazonaws.com/assets/common/heritage_collection_image.png"
const CTA_BG_IMAGE = "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2832&auto=format&fit=crop";
const PROFILE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCNIH-MWRYBI2sO5s41kK_EVUoOI_9jFW3XPQrTeLEnohw1BETES228GcY8LlG3Z7pQ0mRaB2m0ixLoYXdcg_m6I0bPycVqKfp2vpV2y3tuxDkEipaViHX2eEqqBjs7jy4hkh6jjYhiNCRW77lgrNlNake3S4PSW9zyRbmZRVpYmcm4SaOxVPbYuWAG--9OFOtDPPGxgxT9sBbyO0tMLSX9Cqg2OdFXaLAYfa-1b3u73vc8kIozpVTWQCYdN3zrBU4Bn6iZeVJFq27i";

export default async function Home() {
  const session = await getOptionalVerifiedSession();
  const isVerified = Boolean(session);

  return (
    <Box className="relative flex min-h-screen flex-col bg-[#0B0B0B] pb-24 font-sans text-white antialiased selection:bg-[#C5A059]/30">
      {isVerified ? (
        <VerifiedHeader
          logo={<span className="material-symbols-outlined text-3xl text-[#C5A059]">texture</span>}
          siteName="Heritage Artisan Loom"
          navItems={VERIFIED_NAV_ITEMS}
          profileImageUrl={PROFILE_IMAGE}
        />
      ) : (
        <AppHeader
          logo={<span className="material-symbols-outlined size-6 text-2xl text-[#C5A059]">texture</span>}
          siteName="Heritage Artisan Loom"
          navItems={DEFAULT_NAV_ITEMS}
        />
      )}

      <Box component="main" className={isVerified ? "grow pt-16" : "grow pt-20"}>
        <HeroSection
          eyebrow="Exclusive Wholesale Access"
          headline="2026 Heritage Collection"
          description="Exquisite weaves for the modern atelier. Discover textures that define the next generation of luxury."
          ctaLabel="Login to Access"
          isVerified={isVerified}
          backgroundImageUrl={BG_IMAGE}
          ctaHref="/login"
        />

        <HomeCatalogSection />


        {!isVerified && (
          <CTASection
            title="Join Heritage Artisan Loom"
            description="You've reached the end of the public preview. To browse our full catalog of 500+ premium textiles and view wholesale pricing, please apply for partner access."
            buttonLabel="Apply for Membership"
            disclaimer="Requires Valid EIN / Tax ID."
            backgroundImageUrl={CTA_BG_IMAGE}
          />
        )}
      </Box>

      {!isVerified && <FloatingBar message="Pricing Locked" actionLabel="Login to Access" />}
    </Box>
  );
}