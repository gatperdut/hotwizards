import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PushModule } from '../push/push.module.js';
import { AdventuresController } from './adventures.controller.js';
import { AdventuresGateway } from './adventures.gateway.js';
import { AdventuresService } from './adventures.service.js';

@Module({
  controllers: [AdventuresController],
  providers: [AdventuresGateway, AdventuresService],
  imports: [PrismaModule, AuthModule, PushModule],
  exports: [],
})
export class AdventuresModule {}
