import { HwHero } from '@hw/shared/dungeon';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

export const CurrentHero = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwHero => {
    return executionContext.switchToHttp().getRequest<HwRequest>().hero;
  },
);
