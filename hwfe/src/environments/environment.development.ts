import { AppEnvironment } from '@hw/hwfe/environments/environment.model.js';

export const environment: AppEnvironment = {
  production: false,
  sentryDsn: undefined,
  hwfeSentryRelease: undefined,
  hwbeUrl: 'http://localhost:3000',
};
