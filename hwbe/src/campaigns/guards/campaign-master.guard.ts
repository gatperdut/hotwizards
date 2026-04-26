import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { HwRequest } from '../../auth/types/hw-request.type.js';

@Injectable()
export class CampaignMasterGuard implements CanActivate {
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const campaign = request.campaign;

    if (campaign.masterId !== user.id) {
      throw new ForbiddenException('You are not the master of this campaign');
    }

    return true;
  }
}
