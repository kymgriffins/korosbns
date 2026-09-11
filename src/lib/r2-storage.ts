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

/**
 * Upload a binary Buffer or Uint8Array directly to Cloudflare R2 bucket.
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer | Uint8Array,
  contentType = "application/octet-stream",
): Promise<{ url: string; key: string }> {
  const host = `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;
  const region = "auto";
  const service = "s3";
  const bucket = R2_CONFIG.bucketName;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.substring(0, 8);
  const canonicalUri = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, "/")}`;

  const hashedPayload = crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");

  let canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${hashedPayload}\nx-amz-date:${amzDate}\n`;
  let signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    hashedPayload,
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
  const signature = crypto
    .createHmac("sha256", kSigning)
    .update(stringToSign)
    .digest("hex");

  const authHeader = `AWS4-HMAC-SHA256 Credential=${R2_CONFIG.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

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

  const publicUrl = `${R2_CONFIG.publicDomain.replace(/\/$/, "")}/${key}`;
  return { url: publicUrl, key };
}
