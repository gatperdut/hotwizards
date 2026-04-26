import { Membership } from '@hw/prismagen/client';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../auth/types/request.type.js';

export const CurrentMembership = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): Membership => {
    return executionContext.switchToHttp().getRequest<HwRequest>().membership;
  },
);
