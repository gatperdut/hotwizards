import { HwCharacter } from '@hw/shared/characters';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

export const CurrentCharacter = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwCharacter => {
    return executionContext.switchToHttp().getRequest<HwRequest>().character;
  },
);
