import { HwUser } from '@hw/shared';
import { Controller, Get } from '@nestjs/common';
import { UserCurrent } from '../users/user-current.decorator.js';
import { CampaignsService } from './campaigns.service.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('mine')
  public mine(@UserCurrent() user: HwUser) {
    return this.campaignsService.search(user.id);
  }
}
