import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RulesetsController } from './rulesets.controller.js';
import { RulesetsService } from './rulesets.service.js';

@Module({
  controllers: [RulesetsController],
  providers: [RulesetsService],
  imports: [PrismaModule],
  exports: [],
})
export class RulesetsModule {}
