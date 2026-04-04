export interface AppEnvironment {
  readonly production: boolean;
  readonly sentryDsn?: string;
  readonly hwfeSentryRelease?: string;
}
