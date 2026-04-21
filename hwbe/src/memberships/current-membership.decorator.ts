import { Membership } from '@hw/prismagen/client';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../auth/types/hw-request.type.js';

export const CurrentMembership = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): Membership => {
    return executionContext.switchToHttp().getRequest<HwRequest>().membership;
  },
);
