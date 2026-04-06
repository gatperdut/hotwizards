import { AppEnvironment } from '@hw/hwfe/environments/environment.model.js';

export const environment: AppEnvironment = {
  production: true,
  sentryDsn: 'HWFE_SENTRY_DSN',
  hwfeSentryRelease: 'HWFE_SENTRY_RELEASE',
};
