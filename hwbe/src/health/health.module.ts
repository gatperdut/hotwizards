import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { HealthController } from './health.controller.js';

@Module({
  controllers: [HealthController],
  providers: [],
  imports: [PrismaModule],
  exports: [],
})
export class HealthModule {}
