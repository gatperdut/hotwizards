import { HwSlot } from '@hw/shared/inventory';
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class SetCharacterGearItemGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const character = request.character;
    const slot: HwSlot = request.body.slot;

    const gearItem = character.inventory.gear[slot];

    if (!gearItem) {
      throw new NotFoundException('Gear item not found');
    }

    request.gearItem = gearItem;

    return true;
  }
}
