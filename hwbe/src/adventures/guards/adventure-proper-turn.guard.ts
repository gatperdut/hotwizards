import { HwRequest } from '@hw/hwbe/auth/types/request.type.js';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class AdventureProperTurnGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const campaign = request.campaign;
    const adventure = request.adventure;

    const userIds = [campaign.master.id, ...campaign.memberships.map((m) => m.userId)];

    if (userIds[adventure.turn] !== user.id) {
      throw new UnprocessableEntityException('You are not on your turn');
    }

    return true;
  }
}
