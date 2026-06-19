import * as Sentry from '@sentry/nextjs';

/**
 * Next.js instrumentation registration
 * This file registers client and server-side Sentry configurations
 * with Next.js's instrumentation hook system.
 *
 * Read more: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side (Node.js runtime)
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime (Vercel Edge Functions, etc.)
    await import('./sentry.edge.config');
  }
}

// Capture errors from Server Components, middleware, and proxies
export const onRequestError = Sentry.captureRequestError;
