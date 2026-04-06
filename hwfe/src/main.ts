import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component.js';
import { appConfig } from './app/app.config.js';
import { environment } from './environments/environment.js';

if (environment.production) {
  void import('@sentry/angular').then((Sentry): void => {
    Sentry.init({
      dsn: environment.sentryDsn,
      release: environment.hwfeSentryRelease,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.1,
      tracePropagationTargets: ['hotwizards.net'],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });

    setTimeout(async (): Promise<void> => {
      Sentry.addIntegration(Sentry.replayIntegration());
    }, 5000);
  });
}

bootstrapApplication(AppComponent, appConfig).catch((err): void => console.error(err));
