import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';

@Injectable()
export class SetCharacterBackpackItemGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const character = request.character;
    const backpackItemId: string = request.body.backpackItemId;

    const backpackItem = character.inventory.backpack.items.find(
      (item) => item.id === backpackItemId,
    );

    if (!backpackItem) {
      throw new NotFoundException('Backpack item not found');
    }

    request.backpackItem = backpackItem;

    return true;
  }
}
