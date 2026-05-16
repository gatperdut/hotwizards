import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

export const CurrentAdventureTemplate = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): HwAdventureTemplate => {
    return executionContext.switchToHttp().getRequest<HwRequest>().adventureTemplate;
  },
);
