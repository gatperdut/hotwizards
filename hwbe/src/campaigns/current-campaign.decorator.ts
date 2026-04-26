import { Campaign } from '@hw/prismagen/client';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../auth/types/request.type.js';

export const CurrentCampaign = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): Campaign => {
    return executionContext.switchToHttp().getRequest<HwRequest>().campaign;
  },
);
