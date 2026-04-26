import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { HwRequest } from '../auth/types/hw-request.type.js';

@Injectable()
export class MembershipPendingGuard implements CanActivate {
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const membership = request.membership;

    if (membership.status !== 'PENDING') {
      throw new ForbiddenException('The membership is not pending');
    }

    return true;
  }
}
