import { cellAt } from '@hw/shared/dungeon';
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class SetHeroLootItemGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const adventure = request.adventure;
    const hero = request.hero;
    const lootItemId: string = request.body.lootItemId;

    const cell = cellAt(adventure.dungeon.cells, hero.x, hero.y);

    const lootItem = cell?.loot.items.find((item) => item.id === lootItemId);

    if (!lootItem) {
      throw new NotFoundException('Loot item not found');
    }

    request.lootItem = lootItem;

    return true;
  }
}
