/**
 * Sentry Edge runtime configuration
 * Used for Edge Functions, middleware, and edge runtime deployments
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  maxBreadcrumbs: 100,
});
