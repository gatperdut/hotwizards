import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { MembershipMasterGuard } from './membership-master.guard.js';
import { MembershipOwnerGuard } from './membership-owner.guard.js';

@Injectable()
export class MembershipOwnerOrMasterGuard implements CanActivate {
  constructor(
    private membershipOwnerGuard: MembershipOwnerGuard,
    private membershipMasterGuard: MembershipMasterGuard,
  ) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    if (
      (await this.membershipOwnerGuard.canActivate(executionContext)) ||
      (await this.membershipMasterGuard.canActivate(executionContext))
    ) {
      return true;
    }

    throw new ForbiddenException('You are neither the owner nor the master of this membership');
  }
}
