import { User } from '@hw/prismagen/client';
import { PlayerDto } from '@hw/shared';
import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserCurrent } from '../users/user-current.decorator.js';
import { CampaignsService } from './campaigns.service.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('mine')
  public mine(@UserCurrent() user: User) {
    return plainToInstance(PlayerDto, user, { excludeExtraneousValues: true });
  }
}
