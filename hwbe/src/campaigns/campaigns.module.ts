import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsService } from './campaigns.service.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService],
  imports: [PrismaModule],
  exports: [CampaignsService],
})
export class CampaignsModule {}
