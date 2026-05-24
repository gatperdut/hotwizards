import { HwMonster } from '@hw/shared/dungeon';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

export const CurrentMonster = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwMonster => {
    return executionContext.switchToHttp().getRequest<HwRequest>().monster;
  },
);
