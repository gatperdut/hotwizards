import { HwItem } from '@hw/shared/inventory';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

export const CurrentGearItem = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwItem => {
    return executionContext.switchToHttp().getRequest<HwRequest>().gearItem;
  },
);
