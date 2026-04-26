import { HwUser } from '@hw/shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../auth/types/request.type.js';

export const CurrentUser = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwUser => {
    return executionContext.switchToHttp().getRequest<HwRequest>().user;
  },
);
