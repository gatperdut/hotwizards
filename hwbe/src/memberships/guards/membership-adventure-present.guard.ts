import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class MembershipAdventurePresentGuard implements CanActivate {
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const campaign = request.campaign;

    return !!campaign.adventure;
  }
}
