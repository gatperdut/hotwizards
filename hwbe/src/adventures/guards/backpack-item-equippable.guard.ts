import { HwItemSlots } from '@hw/shared/inventory';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class BackpackItemEquippableGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const hero = request.hero;
    const backpackItem = request.backpackItem;

    const slot = HwItemSlots[backpackItem.name];

    if (!slot) {
      throw new BadRequestException('Item is not equippable');
    }

    if (hero.inventory.gear[slot]) {
      throw new BadRequestException(`Another items is already equipped in slot ${slot}`);
    }

    return true;
  }
}
