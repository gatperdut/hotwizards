import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class CampaignAdventureNotPresentGuard implements CanActivate {
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const campaign = request.campaign;

    if (campaign.adventure) {
      throw new NotFoundException('The campaign is running an adventure');
    }

    return true;
  }
}
