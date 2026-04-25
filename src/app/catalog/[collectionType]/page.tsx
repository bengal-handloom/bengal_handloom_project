import Link from "next/link";
import { Box, Container, Group, Button } from "@mantine/core";
import { VerifiedHeader } from "@/components/catalog/VerifiedHeader";
import { VerifiedHeroSection } from "@/components/catalog/VerifiedHeroSection";
import { BaleFloatingBar } from "@/components/catalog/BaleFloatingBar";
import { VERIFIED_NAV_ITEMS } from "@/data/verifiedNav";
import { VERIFIED_HERO_IMAGE } from "@/data/wholeSaleFabric";
import { CatalogClientSection } from "@/components/catalog/CatalogClientCatalogSection";
import { decodeCollectionType } from "@/lib/catalogMetadata";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCNIH-MWRYBI2sO5s41kK_EVUoOI_9jFW3XPQrTeLEnohw1BETES228GcY8LlG3Z7pQ0mRaB2m0ixLoYXdcg_m6I0bPycVqKfpV2y3tuxDkEipaViHX2eEqqBjs7jy4hkh6jjYhiNCRW77lgrNlNake3S4PSW9zyRbmZRVpYmcm4SaOxVPbYuWAG--9OFOtDPPGxgxT9sBbyO0tMLSX9Cqg2OdFXbLAYfa-1b3u73vc8kIozpVTWQCYdN3zrBU4Bn6iZeVJFq27i";

type PageProps = { params: Promise<{ collectionType: string }> };

export default async function CollectionTypeCatalogPage({ params }: PageProps) {
  const { collectionType: encoded } = await params;
  const collectionType = decodeCollectionType(encoded);

  return (
    <Box className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#0B0B0B] font-sans text-[#bdb29e] antialiased selection:bg-[#C5A059] selection:text-black">
      <VerifiedHeader
        logo={<span className="material-symbols-outlined text-3xl text-[#C5A059]">texture</span>}
        siteName="Heritage Artisan Loom"
        navItems={VERIFIED_NAV_ITEMS}
        profileImageUrl={PROFILE_IMAGE}
      />

      <Box component="main" className="flex-1 pb-32">
        <VerifiedHeroSection
          eyebrow="Collection"
          headline={collectionType}
          subtitle="Browse this collection and return to all collections anytime."
          backgroundImageUrl={VERIFIED_HERO_IMAGE}
        />

        <Container size="xl" className="px-6 pt-6 lg:px-12">
          <Group>
            <Link
              href="/"
              className="rounded-lg border border-[#C5A059] bg-transparent font-semibold text-[#C5A059] hover:bg-[#C5A059]/10"
            >
              Back to all collections
            </Link>
          </Group>
        </Container>

        <CatalogClientSection fixedCollectionType={collectionType} />
      </Box>

      <BaleFloatingBar />
    </Box>
  );
}