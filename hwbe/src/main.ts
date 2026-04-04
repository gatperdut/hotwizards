import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const production: boolean = configService.get<string>('NODE_ENV') === 'production';

  // CORS
  if (!production) {
    app.enableCors({
      origin: configService.get<string>('HWFE_URL'),
      credentials: true,
    });
  }

  // Global prefix
  app.setGlobalPrefix('api');

  // Listen
  const port: number = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}

void bootstrap();
