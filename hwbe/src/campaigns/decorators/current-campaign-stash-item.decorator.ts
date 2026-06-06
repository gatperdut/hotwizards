import { HwRequest } from '@hw/hwbe/auth/types/request.type.js';
import { HwItem } from '@hw/shared/inventory';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentCampaignStashItem = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwItem => {
    return executionContext.switchToHttp().getRequest<HwRequest>().stashItem;
  },
);
