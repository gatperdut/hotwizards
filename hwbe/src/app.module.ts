import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ErrorController } from './error.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserController } from './user.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SentryModule.forRoot(),
    // Needed in AppModule at all? Maybe should be global?
    PrismaModule,
  ],
  controllers: [AppController, ErrorController, UserController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
  ],
})
export class AppModule {
  // Empty
}
