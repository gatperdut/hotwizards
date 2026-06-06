import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class SetCampaignStashItemGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const campaign = request.campaign;
    const stashItemId: string = request.body.stashItemId;

    const stashItem = campaign.stash.items.find((item) => item.id === stashItemId);

    if (!stashItem) {
      throw new NotFoundException('Stash item not found');
    }

    request.stashItem = stashItem;

    return true;
  }
}
