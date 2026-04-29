/**
 * Centralized API configuration.
 *
 * In production the env var NEXT_PUBLIC_API_BASE_URL should be set to
 * "https://api.budgetndiostory.org".  The fallback below guarantees that even
 * if the variable is missing, every fetch in the app targets the production
 * API rather than localhost.
 *
 * For local development, create a `.env.local` file and set:
 *   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
 */

const PRODUCTION_API = "https://api.budgetndiostory.org";

/** Base URL for the Django API, without a trailing slash. */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || PRODUCTION_API
).replace(/\/+$/, "");
