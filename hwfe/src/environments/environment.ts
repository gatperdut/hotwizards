import { AppEnvironment } from '@hw/hwfe/environments/environment.model.js';

export const environment: AppEnvironment = {
  production: true,
  sentryDsn: 'HWFE_SENTRY_DSN_PLACEHOLDER',
  hwfeSentryRelease: 'HWFE_SENTRY_RELEASE_PLACEHOLDER',
  hwbeUrl: 'HWFE_HWBE_URL',
  vapidKey: 'HWFE_PUBLIC_VAPID_KEY',
};
