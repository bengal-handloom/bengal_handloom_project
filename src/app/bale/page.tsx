import { Box } from "@mantine/core";
import { VerifiedHeader } from "@/components/catalog/VerifiedHeader";
import { VERIFIED_NAV_ITEMS } from "@/data/verifiedNav";
import { BaleBuilderLayout } from "@/components/bale/BaleBuilderLayout";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCNIH-MWRYBI2sO5s41kK_EVUoOI_9jFW3XPQrTeLEnohw1BETES228GcY8LlG3Z7pQ0mRaB2m0ixLoYXdcg_m6I0bPycVqKfp2vpV2y3tuxDkEipaViHX2eEqqBjs7jy4hkh6jjYhiNCRW77lgrNlNake3S4PSW9zyRbmZRVpYmcm4SaOxVPbYuWAG--9OFOtDPPGxgxT9sBbyO0tMLSX9Cqg2OdFXaLAYfa-1b3u73vc8kIozpVTWQCYdN3zrBU4Bn6iZeVJFq27i";

export default function BaleBuilderPage() {
  return (
    <Box className="min-h-screen bg-[#0B0B0B] font-sans text-[#bdb29e] antialiased">
      <VerifiedHeader
        logo={<span className="material-symbols-outlined text-3xl text-[#C5A059]">deployed_code</span>}
        siteName="Heritage Artisan Loom"
        navItems={[{ label: "Catalog", href: "/catalog" }, ...VERIFIED_NAV_ITEMS]}
        profileImageUrl={PROFILE_IMAGE}
      />
      <BaleBuilderLayout />
    </Box>
  );
}