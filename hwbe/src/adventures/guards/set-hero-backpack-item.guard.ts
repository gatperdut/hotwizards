import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class SetHeroBackpackItemGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const hero = request.hero;
    const backpackItemId: string = request.body.backpackItemId;

    const backpackItem = hero.inventory.backpack.items.find((item) => item.id === backpackItemId);

    if (!backpackItem) {
      throw new NotFoundException('Backpack item not found');
    }

    request.backpackItem = backpackItem;

    return true;
  }
}
