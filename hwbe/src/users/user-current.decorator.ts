import { User } from '@hw/prismagen/client';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../auth/types/auth-request.type.js';

export const UserCurrent = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): User => {
    return executionContext.switchToHttp().getRequest<AuthRequest>().user;
  },
);
