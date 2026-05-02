import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AdventureTemplatesModule } from './adventures-templates/adventure-templates.module.js';
import { AppService } from './app.service.js';
import { AuthMiddleware } from './auth/auth.middleware.js';
import { AuthModule } from './auth/auth.module.js';
import { CampaignsModule } from './campaigns/campaigns.module.js';
import { CharactersModule } from './characters/characters.module.js';
import { HealthModule } from './health/health.module.js';
import { MembershipsModule } from './memberships/memberships.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RulesetsModule } from './rulesets/rulesets.module.js';
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
    HealthModule,
    AuthModule,
    UsersModule,
    CampaignsModule,
    RulesetsModule,
    MembershipsModule,
    CharactersModule,
    AdventureTemplatesModule,
  ],
  controllers: [],
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
        { path: 'users/email-available', method: RequestMethod.GET },
        { path: 'users/handle-available', method: RequestMethod.GET },
      )
      .forRoutes('*splat');
  }
}
