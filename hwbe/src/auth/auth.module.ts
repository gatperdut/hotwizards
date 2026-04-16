import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      global: true,
      secret: 'YOUR_SECRET_KEY', // TODO .env
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule,
    PrismaModule,
    UsersModule,
  ],
  exports: [AuthService],
})
export class AuthModule {
  // Empty
}
