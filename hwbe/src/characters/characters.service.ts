import { HwCampaign } from '@hw/shared/campaigns';
import { HwCharacter } from '@hw/shared/characters';
import { HwItem, HwItemSlots, HwSlot } from '@hw/shared/inventory';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InputJsonValue } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CharactersGateway } from './characters.gateway.js';

@Injectable()
export class CharactersService {
  constructor(
    private prismaService: PrismaService,
    private charactersGateway: CharactersGateway,
  ) {}

  // TODO return Promise<void>
  public async equipItem(
    campaign: HwCampaign,
    character: HwCharacter,
    backpackItem: HwItem,
  ): Promise<void> {
    const inventory = { ...character.inventory };

    const slot = HwItemSlots[backpackItem.name];
    if (!slot) {
      throw new UnprocessableEntityException(`Item ${backpackItem.name} cannot be equiped`);
    }

    inventory.gear[slot] = backpackItem;
    inventory.backpack.items = inventory.backpack.items.filter((i) => i.id !== backpackItem.id);

    void (await this.prismaService.character.update({
      where: { id: character.id },
      data: {
        inventory: inventory as unknown as InputJsonValue,
      },
    }));

    this.charactersGateway.handleDownEquipItem(campaign.id, character.id, backpackItem.id);
  }

  public async unequipItem(
    campaign: HwCampaign,
    character: HwCharacter,
    slot: HwSlot,
  ): Promise<void> {
    const inventory = { ...character.inventory };

    const item = inventory.gear[slot];
    if (!item) {
      throw new UnprocessableEntityException(`No item equipped in slot ${slot}`);
    }

    inventory.gear[slot] = null;
    inventory.backpack.items.unshift(item);

    void (await this.prismaService.character.update({
      where: { id: character.id },
      data: {
        inventory: inventory as unknown as InputJsonValue,
      },
    }));

    this.charactersGateway.handleDownUnequipItem(campaign.id, character.id, slot);
  }
}
