import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  FABRICS_COLLECTION,
  fabricItemFromDoc,
} from "@/lib/fabricCatalogFirestore";
import { getOptionalVerifiedSession } from "@/lib/getOptionalSession";
import { mapFabricCatalogItemFull, mapFabricCatalogItemPublic } from "@/lib/mapFabricCatalogItem";
import { getSignedReadUrl } from "@/lib/s3";
import { FabricCatalogItem } from "@/types/fabricCatalog";


export const runtime = "nodejs";

const MAX = 5000;

const IMAGE_URL_TTL_SEC = 60 * 15; // 15 minutes — tune as needed
async function attachSignedImageUrls(items: FabricCatalogItem[]): Promise<FabricCatalogItem[]> {
  return Promise.all(
    items.map(async (f) => {
      const [small, large] = await Promise.all([
        f.imageSmallUrl
          ? getSignedReadUrl({ keyOrUrl: f.imageSmallUrl, expiresInSec: IMAGE_URL_TTL_SEC })
          : null,
        f.imageLargeUrl
          ? getSignedReadUrl({ keyOrUrl: f.imageLargeUrl, expiresInSec: IMAGE_URL_TTL_SEC })
          : null,
      ]);
      return {
        ...f,
        imageSmallUrl: small?.signedUrl ?? f.imageSmallUrl,
        imageLargeUrl: large?.signedUrl ?? f.imageLargeUrl,
      };
    })
  );
}



export async function GET() {
  const session = await getOptionalVerifiedSession();
  const visibility = session ? "full" : "public";

  try {
    const coll = adminDb.collection(FABRICS_COLLECTION);
    const snap = await coll.orderBy("sku", "asc").limit(MAX).get();
    const raw = snap.docs.map((doc) => fabricItemFromDoc(doc.id, doc.data()));

    const fabrics =
      visibility === "full"
        ? raw.map(mapFabricCatalogItemFull)
        : raw.map(mapFabricCatalogItemPublic);

    const fabricsWithSignedUrls = await attachSignedImageUrls(fabrics);
    return NextResponse.json({
      visibility,
      fabrics: fabricsWithSignedUrls,
      imageUrlExpiresInSec: IMAGE_URL_TTL_SEC, // optional: helps client refetch before expiry
    });
  } catch (err) {
    console.error("[api/catalog/fabrics GET]", err);
    const message = err instanceof Error ? err.message : "Failed to load fabrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}