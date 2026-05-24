import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class SetAdventureMonsterGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const adventure = request.adventure;
    const monsterId: number = request.body.monsterId;

    const monster = adventure.dungeon.monsters.find((monster) => monster.id === monsterId);

    if (monster) {
      request.monster = monster;
    }

    return !!monster;
  }
}
