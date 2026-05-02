import { HwAdventure } from '@hw/shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

export const CurrentAdventure = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwAdventure => {
    return executionContext.switchToHttp().getRequest<HwRequest>().adventure;
  },
);
