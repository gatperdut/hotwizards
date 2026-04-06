import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class SentryLazyErrorHandler implements ErrorHandler {
  public handleError(error: any): void {
    console.error(error);

    import('@sentry/angular')
      .then((Sentry): void => {
        Sentry.captureException(error);
      })
      .catch((chunkError): void => {
        console.error('Sentry lazy-loaded ErrorHandler failed:', chunkError);
      });
  }
}
