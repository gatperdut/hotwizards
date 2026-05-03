import { HwRequest } from '@hw/hwbe/auth/types/request.type.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdventureProperTurnGuard implements CanActivate {
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const campaign = request.campaign;
    const adventure = request.adventure;

    const userIds = [campaign.master.id, ...campaign.memberships.map((m) => m.userId)];

    return userIds[adventure.turn] === user.id;
  }
}
