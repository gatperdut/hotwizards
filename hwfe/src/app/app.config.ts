import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import * as Sentry from '@sentry/angular';
import { routes } from './app.routes.js';
import { PwaService } from './pwa/services/pwa.service.js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
    provideAppInitializer((): void => {
      inject(PwaService);
    }),
    provideAppInitializer((): void => {
      const iconRegistry = inject(MatIconRegistry);
      iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        floatLabel: 'always',
      },
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        // TODO test true to see "crash report" popup
        showDialog: false,
      }),
    },
  ],
};
