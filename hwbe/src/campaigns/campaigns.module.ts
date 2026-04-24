import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignMasterGuard } from './campaign-master.guard.js';
import { CampaignUserGuard } from './campaign-user.guard.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsService } from './campaigns.service.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignUserGuard, CampaignMasterGuard],
  imports: [PrismaModule],
  exports: [CampaignsService, CampaignUserGuard, CampaignMasterGuard],
})
export class CampaignsModule {}
