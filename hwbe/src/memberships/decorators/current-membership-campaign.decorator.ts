import { HwCampaign } from '@hw/shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

export const CurrentMembershipCampaign = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwCampaign => {
    return executionContext.switchToHttp().getRequest<HwRequest>().campaign;
  },
);
