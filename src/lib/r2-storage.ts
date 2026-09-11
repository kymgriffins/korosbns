import crypto from "node:crypto";

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

export function getMediaTypeFromKey(key: string): { mimeType: string; mediaType: "video" | "image" | "document" | "other" } {
  const ext = key.split(".").pop()?.toLowerCase() || "";
  if (["mp4", "webm", "mov", "m4v", "ogv"].includes(ext)) {
    return {
      mimeType: ext === "mp4" ? "video/mp4" : ext === "webm" ? "video/webm" : "video/quicktime",
      mediaType: "video",
    };
  }
  if (["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext)) {
    return {
      mimeType: ext === "png" ? "image/png" : ext === "svg" ? "image/svg+xml" : ext === "webp" ? "image/webp" : "image/jpeg",
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

  const publicUrl = `${R2_CONFIG.publicDomain.replace(/\/$/, "")}/${encodeURI(key)}`;
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
        url: `${R2_CONFIG.publicDomain.replace(/\/$/, "")}/${encodeURI(rawKey)}`,
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
