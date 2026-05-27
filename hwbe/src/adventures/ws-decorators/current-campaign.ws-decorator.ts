import { HwCampaign } from '@hw/shared/campaigns';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const CurrentCampaignWs = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwCampaign => {
    return executionContext.switchToWs().getClient<Socket>().campaign;
  },
);
