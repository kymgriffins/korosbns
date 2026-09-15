import crypto from "crypto";

export const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID || "7ff1ad5f31619e9e1a31b969ed85d05b",
  accessKeyId: process.env.R2_ACCESS_KEY_ID || "8465b4231b835e120cac3c9bd46e563b",
  secretAccessKey:
    process.env.R2_SECRET_ACCESS_KEY ||
    "4d38195635d31a10bff9723ec83a6652b8ef9855150ed00b31185a148f7dff91",
  bucketName: process.env.R2_BUCKET_NAME || "bns",
  publicDomain:
    process.env.R2_PUBLIC_URL ||
    "https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev",
};

export type R2ObjectItem = {
  key: string;
  size: number;
  lastModified: string;
  url: string;
  mimeType: string;
  mediaType: "video" | "image" | "document" | "other";
};

/** Public CDN URL with each path segment encoded (spaces, unicode, #, etc.). */
export function buildR2PublicUrl(key: string): string {
  const base = R2_CONFIG.publicDomain.replace(/\/$/, "");
  const path = key
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/${path}`;
}

export function getMediaTypeFromKey(key: string): { mimeType: string; mediaType: "video" | "image" | "document" | "other" } {
  const ext = key.split(".").pop()?.toLowerCase() || "";
  if (["mp4", "webm", "mov", "m4v", "ogv"].includes(ext)) {
    return {
      mimeType: ext === "mp4" ? "video/mp4" : ext === "webm" ? "video/webm" : "video/quicktime",
      mediaType: "video",
    };
  }
  if (["jpg", "jpeg", "png", "webp", "gif", "svg", "avif", "bmp", "heic", "heif", "tif", "tiff"].includes(ext)) {
    return {
      mimeType:
        ext === "png"
          ? "image/png"
          : ext === "svg"
            ? "image/svg+xml"
            : ext === "webp"
              ? "image/webp"
              : ext === "gif"
                ? "image/gif"
                : ext === "avif"
                  ? "image/avif"
                  : "image/jpeg",
      mediaType: "image",
    };
  }
  if (["pdf", "doc", "docx", "csv", "xlsx"].includes(ext)) {
    return {
      mimeType: ext === "pdf" ? "application/pdf" : "application/octet-stream",
      mediaType: "document",
    };
  }
  return { mimeType: "application/octet-stream", mediaType: "other" };
}

function createSignature(
  method: string,
  canonicalUri: string,
  canonicalQueryString: string,
  headers: Record<string, string>,
  payloadHash: string,
  amzDate: string,
  dateStamp: string,
) {
  const host = `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;
  const region = "auto";
  const service = "s3";

  const sortedHeaderKeys = Object.keys(headers).sort();
  const canonicalHeaders = sortedHeaderKeys
    .map((k) => `${k.toLowerCase()}:${headers[k].trim()}\n`)
    .join("");
  const signedHeaders = sortedHeaderKeys.map((k) => k.toLowerCase()).join(";");

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");

  function hmac(k: Buffer | string, d: string) {
    return crypto.createHmac("sha256", k).update(d).digest();
  }

  const kDate = hmac("AWS4" + R2_CONFIG.secretAccessKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  const authHeader = `AWS4-HMAC-SHA256 Credential=${R2_CONFIG.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return { authHeader, host };
}

/**
 * Upload a binary Buffer or Uint8Array directly to Cloudflare R2 bucket.
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer | Uint8Array,
  contentType = "application/octet-stream",
): Promise<{ url: string; key: string }> {
  const bucket = R2_CONFIG.bucketName;
  const canonicalUri = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, "/")}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.substring(0, 8);
  const host = `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;

  const hashedPayload = crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");

  const headers = {
    "content-type": contentType,
    host,
    "x-amz-content-sha256": hashedPayload,
    "x-amz-date": amzDate,
  };

  const { authHeader } = createSignature(
    "PUT",
    canonicalUri,
    "",
    headers,
    hashedPayload,
    amzDate,
    dateStamp,
  );

  const uploadEndpoint = `https://${host}${canonicalUri}`;

  const res = await fetch(uploadEndpoint, {
    method: "PUT",
    headers: {
      Host: host,
      "Content-Type": contentType,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": hashedPayload,
      Authorization: authHeader,
    },
    body: buffer as unknown as BodyInit,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`R2 upload failed (${res.status}): ${errText}`);
  }

  const publicUrl = buildR2PublicUrl(key);
  return { url: publicUrl, key };
}

/**
 * List objects stored in the Cloudflare R2 bucket.
 */
export async function listR2Objects(prefix = ""): Promise<R2ObjectItem[]> {
  const bucket = R2_CONFIG.bucketName;
  const canonicalUri = `/${bucket}`;
  const host = `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.substring(0, 8);

  const queryParams: string[] = ["list-type=2"];
  if (prefix) {
    queryParams.push(`prefix=${encodeURIComponent(prefix)}`);
  }
  queryParams.sort();
  const canonicalQueryString = queryParams.join("&");

  const emptyHash = crypto.createHash("sha256").update("").digest("hex");

  const headers = {
    host,
    "x-amz-content-sha256": emptyHash,
    "x-amz-date": amzDate,
  };

  const { authHeader } = createSignature(
    "GET",
    canonicalUri,
    canonicalQueryString,
    headers,
    emptyHash,
    amzDate,
    dateStamp,
  );

  const listEndpoint = `https://${host}${canonicalUri}?${canonicalQueryString}`;

  const res = await fetch(listEndpoint, {
    method: "GET",
    headers: {
      Host: host,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": emptyHash,
      Authorization: authHeader,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`R2 list objects failed (${res.status}): ${errText}`);
  }

  const xmlText = await res.text();

  // Match all <Contents> blocks
  const items: R2ObjectItem[] = [];
  const contentRegex = /<Contents>([\s\S]*?)<\/Contents>/g;
  let match: RegExpExecArray | null;

  while ((match = contentRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const keyMatch = /<Key>(.*?)<\/Key>/.exec(block);
    const sizeMatch = /<Size>(\d+)<\/Size>/.exec(block);
    const modifiedMatch = /<LastModified>(.*?)<\/LastModified>/.exec(block);

    if (keyMatch && keyMatch[1]) {
      const rawKey = keyMatch[1].replace(/&amp;/g, "&");
      const size = sizeMatch ? parseInt(sizeMatch[1], 10) : 0;
      const lastModified = modifiedMatch ? modifiedMatch[1] : new Date().toISOString();
      const { mimeType, mediaType } = getMediaTypeFromKey(rawKey);

      items.push({
        key: rawKey,
        size,
        lastModified,
        url: buildR2PublicUrl(rawKey),
        mimeType,
        mediaType,
      });
    }
  }

  // Sort newest first
  return items.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
}

/**
 * Delete an object from Cloudflare R2 bucket.
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  const bucket = R2_CONFIG.bucketName;
  const canonicalUri = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
  const host = `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.substring(0, 8);

  const emptyHash = crypto.createHash("sha256").update("").digest("hex");

  const headers = {
    host,
    "x-amz-content-sha256": emptyHash,
    "x-amz-date": amzDate,
  };

  const { authHeader } = createSignature(
    "DELETE",
    canonicalUri,
    "",
    headers,
    emptyHash,
    amzDate,
    dateStamp,
  );

  const deleteEndpoint = `https://${host}${canonicalUri}`;

  const res = await fetch(deleteEndpoint, {
    method: "DELETE",
    headers: {
      Host: host,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": emptyHash,
      Authorization: authHeader,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errText = await res.text();
    throw new Error(`R2 delete failed (${res.status}): ${errText}`);
  }

  return true;
}

/**
 * Persist arbitrary JSON payload directly into Cloudflare R2 bucket.
 */
export async function saveJsonToR2(
  key: string,
  data: unknown,
): Promise<{ url: string; key: string }> {
  const jsonStr = JSON.stringify(data, null, 2);
  const buffer = Buffer.from(jsonStr, "utf-8");
  return uploadToR2(key, buffer, "application/json; charset=utf-8");
}

/**
 * Retrieve JSON payload from Cloudflare R2 bucket.
 */
export async function getJsonFromR2<T = unknown>(key: string): Promise<T | null> {
  // 1. Try fetching via public domain first (fastest CDN edge route)
  const publicUrl = buildR2PublicUrl(key);
  try {
    const res = await fetch(publicUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json()) as T;
      return data;
    }
  } catch {
    // Fall back to AWS4 signed GET
  }

  // 2. Fall back to AWS4 signed GET directly against R2 storage host
  try {
    const bucket = R2_CONFIG.bucketName;
    const canonicalUri = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
    const host = `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);
    const emptyHash = crypto.createHash("sha256").update("").digest("hex");

    const headers = {
      host,
      "x-amz-content-sha256": emptyHash,
      "x-amz-date": amzDate,
    };

    const { authHeader } = createSignature(
      "GET",
      canonicalUri,
      "",
      headers,
      emptyHash,
      amzDate,
      dateStamp,
    );

    const getEndpoint = `https://${host}${canonicalUri}`;
    const res = await fetch(getEndpoint, {
      method: "GET",
      headers: {
        Host: host,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": emptyHash,
        Authorization: authHeader,
      },
    });

    if (res.ok) {
      return (await res.json()) as T;
    }
    return null;
  } catch (err) {
    console.warn(`[Cloudflare R2] Failed to fetch key ${key}:`, err);
    return null;
  }
}

/**
 * Fetch an object body from R2 (public CDN first, then signed GET).
 * Used for CMS thumbnail previews so editors always see visuals.
 */
export async function fetchR2Object(
  key: string,
): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const { mimeType } = getMediaTypeFromKey(key);
  const publicUrl = buildR2PublicUrl(key);

  try {
    const res = await fetch(publicUrl, {
      cache: "force-cache",
      headers: { Accept: "image/*,video/*,*/*" },
    });
    if (res.ok) {
      const body = await res.arrayBuffer();
      const contentType =
        res.headers.get("content-type") || mimeType || "application/octet-stream";
      return { body, contentType };
    }
  } catch {
    // fall through to signed GET
  }

  try {
    const bucket = R2_CONFIG.bucketName;
    const canonicalUri = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
    const host = `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);
    const emptyHash = crypto.createHash("sha256").update("").digest("hex");

    const headers = {
      host,
      "x-amz-content-sha256": emptyHash,
      "x-amz-date": amzDate,
    };

    const { authHeader } = createSignature(
      "GET",
      canonicalUri,
      "",
      headers,
      emptyHash,
      amzDate,
      dateStamp,
    );

    const getEndpoint = `https://${host}${canonicalUri}`;
    const res = await fetch(getEndpoint, {
      method: "GET",
      headers: {
        Host: host,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": emptyHash,
        Authorization: authHeader,
      },
    });

    if (!res.ok) return null;
    const body = await res.arrayBuffer();
    const contentType =
      res.headers.get("content-type") || mimeType || "application/octet-stream";
    return { body, contentType };
  } catch (err) {
    console.warn(`[Cloudflare R2] Failed to fetch object ${key}:`, err);
    return null;
  }
}

/**
 * Purge Cloudflare Edge Zone Cache so that all changes are instantly live across global CDN.
 */
export async function purgeCloudflareEdgeCache(files?: string[]): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID || "ef1c213b96e276abef54491908de9e72";
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || "cfat_hiu5BjpjZwM28YiC50KLa8Wz3d848zhQDvEQl9BTb0e066ad";

  if (!zoneId || !apiToken) {
    return { success: false, error: "Missing Cloudflare Zone ID or API Token" };
  }

  try {
    const purgeBody = files && files.length > 0
      ? JSON.stringify({ files })
      : JSON.stringify({ purge_everything: true });

    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: purgeBody,
    });

    const data = (await res.json()) as { success: boolean; errors?: unknown[] };
    if (data.success) {
      return { success: true, message: "Cloudflare Edge CDN cache purged successfully." };
    }
    return {
      success: false,
      error: `Cloudflare purge response: ${JSON.stringify(data.errors || [])}`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Cloudflare purge request failed",
    };
  }
}
