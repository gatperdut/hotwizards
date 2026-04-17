import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AppService } from './app.service.js';
import { AuthMiddleware } from './auth/auth.middleware.js';
import { AuthModule } from './auth/auth.module.js';
import { CampaignsModule } from './campaigns/campaigns.module.js';
import { HealthController } from './health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SentryModule.forRoot(),
    // Needed in AppModule at all? Maybe should be global?
    PrismaModule,
    AuthModule,
    UsersModule,
    CampaignsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        // Health
        { path: 'health', method: RequestMethod.GET },
        // Auth
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/verify-token', method: RequestMethod.POST },
        // User
        { path: 'users/availability-email', method: RequestMethod.GET },
        { path: 'users/availability-handle', method: RequestMethod.GET },
      )
      .forRoutes('*splat');
  }
}
