import { HwUser } from '@hw/shared/users';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const CurrentMasterWs = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwUser => {
    return executionContext.switchToWs().getClient<Socket>().master;
  },
);
