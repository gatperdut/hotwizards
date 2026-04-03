import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication<any> = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(process.env['PORT'] ?? 3000);
}

bootstrap();
