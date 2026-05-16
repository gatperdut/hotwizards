import { HwMembership } from '@hw/shared/memberships';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

export const CurrentMembership = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwMembership => {
    return executionContext.switchToHttp().getRequest<HwRequest>().membership;
  },
);
