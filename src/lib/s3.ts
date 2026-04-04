import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const region = process.env.AWS_REGION!;
const bucket = "digital-loom";
const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL!;
const nextPublicBaseUrl = process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BASE_URL!;

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function sanitizePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

function extFromName(fileName: string) {
  const idx = fileName.lastIndexOf(".");
  return idx > -1 ? fileName.slice(idx).toLowerCase() : "";
}

export function buildFabricImageKey(params: {
  fabricName: string;
  imageKind: "large" | "small";
  originalFileName: string;
}) {
  const fabric = sanitizePart(params.fabricName || "unknown-fabric");
  const baseName = sanitizePart(params.originalFileName.replace(/\.[^/.]+$/, "")) || "image";
  const ext = extFromName(params.originalFileName) || ".bin";
  const ts = Date.now();
  return `fabrics/${fabric}/${params.imageKind}/${ts}-${baseName}${ext}`;
}

export async function uploadFileToS3(input: {
  file: File;
  key: string;
}) {
  const bytes = await input.file.arrayBuffer();
  const body = Buffer.from(bytes);

  return uploadBufferToS3({
    key: input.key,
    body,
    contentType: input.file.type || "application/octet-stream",
  });
}

export async function uploadBufferToS3(input: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType || "application/octet-stream",
    })
  );

  return {
    key: input.key,
    bucket,
    region,
    url: `${publicBaseUrl}/${input.key}`,
  };
}

export function s3KeyToPublicUrl(key: string) {
  const baseUrl = publicBaseUrl??nextPublicBaseUrl
  if (!key) return "";
  if (/^https?:\/\//i.test(key)) return key;
  console.log(baseUrl)
  return `${process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BASE_URL}/${key}`;
}

const DEFAULT_SIGNED_URL_TTL_SEC = 60 * 10; // 10 minutes
function normalizeS3Key(input: string): string {
  const value = (input || "").trim();
  if (!value) return "";
  // Already a key like: fabrics/x/small/abc.webp
  if (!/^https?:\/\//i.test(value)) {
    return value.replace(/^\/+/, "");
  }
  // URL -> key
  const u = new URL(value);
  const pathKey = decodeURIComponent(u.pathname.replace(/^\/+/, ""));
  // If it matches your configured public base, path is the key
  if (publicBaseUrl) {
    const base = new URL(publicBaseUrl);
    if (u.origin === base.origin) return pathKey;
  }
  // If bucket is in hostname: <bucket>.s3.<region>.amazonaws.com/<key>
  if (u.hostname.startsWith(`${bucket}.s3.`)) return pathKey;
  // Fallback: use pathname as key
  return pathKey;
}


export async function getSignedReadUrl(params: {
  keyOrUrl: string;
  expiresInSec?: number;
}) {
  console.log(params.keyOrUrl)
  const key = normalizeS3Key(params.keyOrUrl);
  if (!key) throw new Error("Missing S3 key/url");
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const expiresIn = Math.max(1, Math.min(params.expiresInSec ?? DEFAULT_SIGNED_URL_TTL_SEC, 60 * 60 * 24 * 7));
  const signedUrl = await getSignedUrl(s3, command, { expiresIn });
  return {
    key,
    signedUrl,
    expiresIn,
  };
}