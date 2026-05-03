import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module.js';
import { CharactersModule } from '../characters/characters.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PushModule } from '../push/push.module.js';
import { MembershipsController } from './memberships.controller.js';
import { MembershipsGateway } from './memberships.gateway.js';
import { MembershipsService } from './memberships.service.js';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsGateway],
  imports: [PrismaModule, AuthModule, PushModule, CharactersModule, ConfigModule],
  exports: [MembershipsService],
})
export class MembershipsModule {}
