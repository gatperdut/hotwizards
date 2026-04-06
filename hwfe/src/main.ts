import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';
import { AppComponent } from './app/app.component.js';
import { appConfig } from './app/app.config.js';
import { environment } from './environments/environment.js';

if (environment.production) {
  Sentry.init({
    dsn: environment.sentryDsn,
    release: environment.hwfeSentryRelease,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 0.1,
    tracePropagationTargets: ['localhost', 'hotwizards.net'],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
