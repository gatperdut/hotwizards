import { bootstrapApplication } from '@angular/platform-browser';
import { browserTracingIntegration, init } from '@sentry/angular';
import { AppComponent } from './app/app.component.js';
import { appConfig } from './app/app.config.js';
import { environment } from './environments/environment.js';

// if (environment.production) {
init({
  dsn: environment.sentryDsn,
  release: environment.hwfeSentryRelease,
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 0.1,
  tracePropagationTargets: ['localhost', 'hotwizards.net'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

setTimeout(async (): Promise<void> => {
  const { addIntegration, replayIntegration } = await import('@sentry/angular');

  addIntegration(replayIntegration());
}, 5000);
// }

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
