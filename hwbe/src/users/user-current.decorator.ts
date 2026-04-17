import { HwUser } from '@hw/shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../auth/types/auth-request.type.js';

export const UserCurrent = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwUser => {
    return executionContext.switchToHttp().getRequest<AuthRequest>().user;
  },
);
