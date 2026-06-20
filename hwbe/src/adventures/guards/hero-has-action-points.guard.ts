import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class HeroHasActionPoints implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const hero = request.hero;

    if (hero.actionPoints < 1) {
      throw new UnprocessableEntityException('Hero has not enough action points');
    }

    return true;
  }
}
