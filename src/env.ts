import { z } from "zod";

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}, z.boolean());

const optionalUrl = z.preprocess((val) => (val === "" ? undefined : val), z.string().url().optional());
const defaultUrl = (defaultVal: string) =>
  z.preprocess((val) => (val === "" ? undefined : val), z.string().url().default(defaultVal));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_API_BASE_URL: defaultUrl("https://bnske.budgetndiostory.org"),
  API_PROXY_TARGET: optionalUrl,
  NEXT_PUBLIC_SITE_URL: defaultUrl("https://budgetndiostory.org"),
  NEXT_PUBLIC_DEFAULT_ORG_SLUG: z.string().min(1).default("bns-default"),
  NEXT_PUBLIC_ALLOW_ADMIN_SIGNUP: booleanFromEnv.default(false),
  NEXT_PUBLIC_ENABLE_WIP: booleanFromEnv.default(false),
  NEXT_PUBLIC_DEBUG_LOGS: booleanFromEnv.default(false),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  // Cloudflare R2 & Edge Storage
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: optionalUrl,
  CLOUDFLARE_ZONE_ID: z.string().optional(),
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  API_PROXY_TARGET: process.env.API_PROXY_TARGET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_DEFAULT_ORG_SLUG: process.env.NEXT_PUBLIC_DEFAULT_ORG_SLUG,
  NEXT_PUBLIC_ALLOW_ADMIN_SIGNUP: process.env.NEXT_PUBLIC_ALLOW_ADMIN_SIGNUP,
  NEXT_PUBLIC_ENABLE_WIP: process.env.NEXT_PUBLIC_ENABLE_WIP,
  NEXT_PUBLIC_DEBUG_LOGS: process.env.NEXT_PUBLIC_DEBUG_LOGS,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const data = parsed.data;

function assertApiVsSiteHosts() {
  try {
    const apiHost = new URL(data.NEXT_PUBLIC_API_BASE_URL).hostname;
    const siteHost = new URL(data.NEXT_PUBLIC_SITE_URL).hostname;
    if (apiHost === siteHost) {
      throw new Error(
        `NEXT_PUBLIC_API_BASE_URL must be the API host (e.g. bnske.budgetndiostory.org), not the citizen site (${siteHost}). Registration and login will fail.`,
      );
    }
    const isLocalApi =
      apiHost === "localhost" || apiHost === "127.0.0.1" || apiHost.includes("bnske");
    if (!isLocalApi) {
      console.warn(
        `[env] NEXT_PUBLIC_API_BASE_URL host is "${apiHost}" — expected bnske.budgetndiostory.org or localhost for local dev.`,
      );
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("NEXT_PUBLIC_API_BASE_URL must")) {
      throw err;
    }
    /* URL parse errors are already caught by zod */
  }
}

assertApiVsSiteHosts();

export const env = data;
