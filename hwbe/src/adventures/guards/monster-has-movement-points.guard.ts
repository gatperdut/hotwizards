import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class MonsterHasMovementPoints implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const monster = request.monster;

    if (monster.movementPoints < 1) {
      throw new UnprocessableEntityException('Monster has not enough movement points');
    }

    return true;
  }
}
