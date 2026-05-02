import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AdventuresGateway } from './adventures.gateway.js';

@Module({
  controllers: [],
  providers: [AdventuresGateway],
  imports: [PrismaModule, AuthModule],
  exports: [],
})
export class AdventuresModule {}
