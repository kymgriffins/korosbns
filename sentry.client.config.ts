/**
 * Sentry client-side configuration
 * Organization: Budget Ndio Story (budgetndiostory)
 * Hardcoded to streamline onboarding - no user input required
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || (process.env.NODE_ENV === 'development' ? '1.0' : '0.1')),
    replaysSessionSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_RATE || '0.1'),
    replaysOnErrorSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_RATE || '1.0'),
    maxBreadcrumbs: 100,
    tracePropagationTargets: [/^https:\/\/budgetndiostory\.org/, /^https:\/\/api\.budgetndiostory\.org/],

    // Attach user context for admin actions
    beforeSend(event, hint) {
      // Enrich with admin context
      if (event.user) {
        event.tags = event.tags || {};
        event.tags['user.type'] = 'admin';
        event.tags['organization'] = 'budgetndiostory';
      }
      return event;
    },

    // Capture console errors and warnings
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,  // Mask text for privacy compliance
        blockAllMedia: false,
      }),
    ],
  });
}
