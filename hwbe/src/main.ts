import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import webpush from 'web-push';
import { AppModule } from './app.module.js';
import { SocketIoAdapter } from './sockets/socket-io.adapter.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const production: boolean = configService.get<string>('HWBE_NODE_ENV') === 'production';

  // Sentry
  if (production) {
    Sentry.init({
      dsn: configService.get<string>('HWBE_SENTRY_DSN'),
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      release: configService.get<string>('HWBE_SENTRY_RELEASE'),
    });
  }

  // CORS
  if (!production) {
    app.enableCors({
      origin: configService.get<string>('HWBE_CORS_ORIGIN'),
      credentials: true,
    });
  }

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Socket adapter
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  // VAPID
  webpush.setVapidDetails(
    `mailto:${configService.get<string>('HWBE_VAPID_EMAIL')}`,
    configService.get<string>('HWBE_PUBLIC_VAPID_KEY') as string,
    configService.get<string>('HWBE_PRIVATE_VAPID_KEY') as string,
  );

  // Listen
  const port: number = configService.get<number>('HWBE_PORT') as number;
  await app.listen(port);
}

void bootstrap();
