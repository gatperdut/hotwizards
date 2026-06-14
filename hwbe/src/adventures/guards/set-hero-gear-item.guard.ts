import { HwSlot } from '@hw/shared/inventory';
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class SetHeroGearItemGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const hero = request.hero;
    const slot: HwSlot = request.body.slot;

    const gearItem = hero.inventory.gear[slot];

    if (!gearItem) {
      throw new NotFoundException('Gear item not found');
    }

    request.gearItem = gearItem;

    return true;
  }
}
