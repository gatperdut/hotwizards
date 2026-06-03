import { HwRequest } from '@hw/hwbe/auth/types/request.type.js';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class AdventureCampaignMasterGuard implements CanActivate {
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const client = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = client.user;
    const campaign = client.campaign;

    if (campaign.master.id !== user.id) {
      throw new UnprocessableEntityException('You are not the master of the campaign');
    }

    return true;
  }
}
