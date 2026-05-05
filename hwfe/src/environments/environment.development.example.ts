import { AppEnvironment } from '@hw/hwfe/environments/environment.model.js';

// Copy to environment.development.ts and adjust.
export const environment: AppEnvironment = {
  production: false,
  sentryDsn: undefined,
  hwfeSentryRelease: undefined,
  hwbeUrl: 'http://localhost:3000',
  vapidKey: undefined,
};
