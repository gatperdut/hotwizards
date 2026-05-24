import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class SetAdventureHeroGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const adventure = request.adventure;

    const hero = adventure.dungeon.heroes.find((hero) => hero.id === user.id);

    if (hero) {
      request.hero = hero;
    }

    return !!hero;
  }
}
