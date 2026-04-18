import { HwCampaign, HwCampaignSearchDto, HwUser } from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { UserCurrent } from '../users/user-current.decorator.js';
import { CampaignsService } from './campaigns.service.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Get('mine')
  public mine(
    @UserCurrent() user: HwUser,
    @Query() params: HwCampaignSearchDto,
  ): Promise<HwCampaign[]> {
    return this.campaignsService.search(user.id, params.term);
  }
}
