import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withExperimentalAutoCleanupInjectors } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes.js';
import { authInterceptor } from './auth/interceptors/auth.interceptor.js';
import { PwaService } from './services/pwa.service.js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withExperimentalAutoCleanupInjectors()), // TODO drop withExperimentalAutoCleanupInjectors when ng version makes it default
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
    provideAppInitializer((): void => {
      inject(PwaService);
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
