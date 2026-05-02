import { HwRequest } from '@hw/hwbe/auth/types/request.type.js';
import { HwCampaign } from '@hw/shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentCampaign = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwCampaign => {
    return executionContext.switchToHttp().getRequest<HwRequest>().campaign;
  },
);
