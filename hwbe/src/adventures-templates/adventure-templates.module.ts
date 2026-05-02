import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AdventureTemplatesController } from './adventure-templates.controller.js';
import { AdventureTemplatesService } from './adventure-templates.service.js';

@Module({
  controllers: [AdventureTemplatesController],
  providers: [AdventureTemplatesService],
  imports: [PrismaModule],
  exports: [AdventureTemplatesService],
})
export class AdventureTemplatesModule {}
