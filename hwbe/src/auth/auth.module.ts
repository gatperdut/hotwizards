import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as ms from 'ms';
import { PresenceModule } from '../presence/presence.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthGateway } from './auth.gateway.js';
import { AuthService } from './auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGateway],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('HWBE_JWT_KEY'),
        signOptions: {
          expiresIn: config.get<string>('HWBE_JWT_EXPIRES_IN') as ms.StringValue,
        },
      }),
    }),
    ConfigModule,
    PrismaModule,
    UsersModule,
    PresenceModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
