import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class MembershipOwnerGuard implements CanActivate {
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const membership = request.membership;

    return membership.userId === user.id;
  }
}
