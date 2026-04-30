/**
 * Sentry server-side configuration
 * Organization: Budget Ndio Story (budgetndiostory)
 * Hardcoded to streamline onboarding - no user input required
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || (process.env.NODE_ENV === 'development' ? '1.0' : '0.1')),
    maxBreadcrumbs: 100,
    tracePropagationTargets: [/api\.budgetndiostory\.org/],

    // Filter sensitive data from error reports
    beforeSend(event, hint) {
      // Redact sensitive fields
      const request = event.request;
      if (request) {
        if (request.headers) {
          delete request.headers['authorization'];
          delete request.headers['cookie'];
          delete request.headers['Authorization'];
          delete request.headers['Cookie'];
        }
        if (request.data) {
          // Redact passwords, tokens, and secrets
          const sensitiveKeys = ['password', 'token', 'secret', 'key', 'refresh', 'access'];
          sensitiveKeys.forEach((key) => {
            if (request.data && typeof request.data === 'object' && key in request.data) {
              request.data[key] = '[Filtered]';
            }
          });
        }
      }

      // Add organization tag
      if (event.tags) {
        event.tags['organization'] = 'budgetndiostory';
      }

      return event;
    },

    integrations: [
      Sentry.httpIntegration(),
    ],
  });
}
