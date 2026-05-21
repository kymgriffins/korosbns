/**
 * Centralized API configuration.
 *
 * In production the env var NEXT_PUBLIC_API_BASE_URL should be set to
 * "https://bnske.budgetndiostory.org".  The fallback below guarantees that even
 * if the variable is missing, every fetch in the app targets the production
 * API rather than localhost.
 *
 * For local development, create a `.env.local` file and set:
 *   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
 */

const PRODUCTION_API = "https://bnske.budgetndiostory.org";

const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const isLocal = envUrl && (
  envUrl.includes("localhost") || 
  envUrl.includes("127.0.0.1") || 
  envUrl.includes("0.0.0.0") ||
  envUrl.includes("::1")
);

const base = (
  envUrl && !isLocal ? envUrl : PRODUCTION_API
).replace(/\/+$/, "");

/** Base URL for the Django API, without a trailing slash.
 * In the browser (client-side), we use relative paths (empty string) to route through
 * the Next.js API proxy and bypass CORS restrictions.
 */
export const API_BASE_URL = typeof window !== "undefined" ? "" : base;


