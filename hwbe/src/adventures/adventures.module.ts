import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module.js';
import { CharactersModule } from '../characters/characters.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PushModule } from '../push/push.module.js';
import { AdventuresController } from './adventures.controller.js';
import { AdventuresGateway } from './adventures.gateway.js';
import { AdventuresService } from './adventures.service.js';

@Module({
  controllers: [AdventuresController],
  providers: [AdventuresGateway, AdventuresService],
  imports: [PrismaModule, AuthModule, PushModule, CharactersModule, ConfigModule],
  exports: [],
})
export class AdventuresModule {}
