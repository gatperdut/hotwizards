export interface AppEnvironment {
  production: boolean;
  sentryDsn?: string;
  hwfeSentryRelease?: string;
  hwbeUrl: string;
  vapidKey?: string;
}
