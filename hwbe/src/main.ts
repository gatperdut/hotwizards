import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { AppModule } from './app.module.js';

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

  // Global prefix
  app.setGlobalPrefix('api');

  // Listen
  const port: number = configService.get<number>('HWBE_PORT') as number;
  console.log('Running on PORT', port);

  await app.listen(port);
}

void bootstrap();
