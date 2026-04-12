import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { SentryLazyErrorHandler } from '../sentry-lazy-error-handler.class.js';
import { routes } from './app.routes.js';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor.js';
import { PwaService } from './services/pwa.service.js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAppInitializer((): void => {
      inject(PwaService);
    }),
    provideAppInitializer((): void => {
      const iconRegistry = inject(MatIconRegistry);
      iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    }),
    { provide: ErrorHandler, useClass: SentryLazyErrorHandler },
  ],
};
