import { InputJsonObject, InputJsonValue } from '@hw/prismagen/runtime';
import { HwCampaign } from '@hw/shared/campaigns';
import { equipItem, HwCharacter, unequipItem } from '@hw/shared/characters';
import {
  HwBuyableItemName,
  HwBuyableItemNames,
  HwItem,
  HwItemCosts,
  HwSlot,
} from '@hw/shared/inventory';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CharactersGateway } from './characters.gateway.js';

@Injectable()
export class CharactersService {
  constructor(
    private prismaService: PrismaService,
    private charactersGateway: CharactersGateway,
  ) {}

  public async equipItem(
    campaign: HwCampaign,
    character: HwCharacter,
    backpackItem: HwItem,
  ): Promise<void> {
    equipItem(character, backpackItem.id);

    void (await this.prismaService.character.update({
      where: { id: character.id },
      data: {
        inventory: character.inventory as unknown as InputJsonValue,
      },
    }));

    this.charactersGateway.handleDownEquipItem(campaign.id, character.id, backpackItem.id);
  }

  public async unequipItem(
    campaign: HwCampaign,
    character: HwCharacter,
    slot: HwSlot,
  ): Promise<void> {
    unequipItem(character, slot);

    void (await this.prismaService.character.update({
      where: { id: character.id },
      data: {
        inventory: character.inventory as unknown as InputJsonValue,
      },
    }));

    this.charactersGateway.handleDownUnequipItem(campaign.id, character.id, slot);
  }

  public async dropItem(
    campaign: HwCampaign,
    character: HwCharacter,
    backpackItem: HwItem,
  ): Promise<void> {
    const inventory = { ...character.inventory };
    const stash = { ...campaign.stash };

    inventory.backpack.items = inventory.backpack.items.filter((i) => i.id !== backpackItem.id);
    stash.items.push(backpackItem);

    await this.prismaService.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { inventory: inventory as unknown as InputJsonObject },
      });

      return tx.campaign.update({
        where: { id: campaign.id },
        data: {
          stash: stash as unknown as InputJsonObject,
        },
      });
    });

    this.charactersGateway.handleDownDropItem(campaign.id, character.id, backpackItem.id);
  }

  public async pickupItem(
    campaign: HwCampaign,
    character: HwCharacter,
    stashItem: HwItem,
  ): Promise<void> {
    const inventory = { ...character.inventory };
    const stash = { ...campaign.stash };

    inventory.backpack.items.push(stashItem);
    stash.items = stash.items.filter((i) => i.id !== stashItem.id);

    await this.prismaService.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { inventory: inventory as unknown as InputJsonObject },
      });

      return tx.campaign.update({
        where: { id: campaign.id },
        data: {
          stash: stash as unknown as InputJsonObject,
        },
      });
    });

    this.charactersGateway.handleDownPickupItem(campaign.id, character.id, stashItem.id);
  }

  public async pickupGold(
    campaign: HwCampaign,
    character: HwCharacter,
    amount: number,
  ): Promise<void> {
    const inventory = { ...character.inventory };
    const stash = { ...campaign.stash };

    if (stash.gold < amount) {
      throw new UnprocessableEntityException(
        `Cannot take ${amount} gold coins from a stash of ${stash.gold}`,
      );
    }

    stash.gold -= amount;
    inventory.backpack.gold += amount;

    await this.prismaService.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { inventory: inventory as unknown as InputJsonObject },
      });

      return tx.campaign.update({
        where: { id: campaign.id },
        data: {
          stash: stash as unknown as InputJsonObject,
        },
      });
    });

    this.charactersGateway.handleDownPickupGold(campaign.id, character.id, amount);
  }

  public async buyItem(
    campaign: HwCampaign,
    character: HwCharacter,
    buyableItemName: HwBuyableItemName,
  ): Promise<void> {
    const inventory = { ...character.inventory };

    const cost = HwItemCosts[buyableItemName];

    if (inventory.backpack.gold < cost) {
      throw new UnprocessableEntityException(
        `Cannot buy ${buyableItemName} for ${cost} with ${inventory.backpack.gold} gold pieces`,
      );
    }

    const boughtItem: HwItem = { id: crypto.randomUUID(), name: buyableItemName };

    inventory.backpack.gold -= cost;
    inventory.backpack.items.unshift(boughtItem);

    await this.prismaService.character.update({
      where: { id: character.id },
      data: { inventory: inventory as unknown as InputJsonObject },
    });

    this.charactersGateway.handleDownBuyItem(campaign.id, character.id, boughtItem);
  }

  public async sellItem(
    campaign: HwCampaign,
    character: HwCharacter,
    backpackItem: HwItem,
  ): Promise<void> {
    if (!HwBuyableItemNames.includes(backpackItem.name as HwBuyableItemName)) {
      throw new UnprocessableEntityException(`Item ${backpackItem.name} is not sellable`);
    }

    const inventory = { ...character.inventory };

    inventory.backpack.items = inventory.backpack.items.filter((i) => i.id !== backpackItem.id)!;
    inventory.backpack.gold += Math.round(HwItemCosts[backpackItem.name as HwBuyableItemName] / 2);

    await this.prismaService.character.update({
      where: { id: character.id },
      data: { inventory: inventory as unknown as InputJsonObject },
    });

    this.charactersGateway.handleDownSellItem(campaign.id, character.id, backpackItem.id);
  }

  public async giveGold(
    campaign: HwCampaign,
    character: HwCharacter,
    targetCharacter: HwCharacter,
    amount: number,
  ): Promise<void> {
    if (character.id === targetCharacter.id) {
      throw new UnprocessableEntityException('Cannot give gold coins to yourself');
    }

    const inventory = { ...character.inventory };
    const targetInventory = { ...targetCharacter.inventory };

    inventory.backpack.gold -= amount;
    targetInventory.backpack.gold += amount;

    await this.prismaService.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { inventory: inventory as unknown as InputJsonObject },
      });

      return tx.character.update({
        where: { id: targetCharacter.id },
        data: {
          inventory: targetInventory as unknown as InputJsonObject,
        },
      });
    });

    this.charactersGateway.handleDownGiveGold(
      campaign.id,
      character.id,
      targetCharacter.id,
      amount,
    );
  }

  public async destroyItem(
    campaign: HwCampaign,
    character: HwCharacter,
    backpackItem: HwItem,
  ): Promise<void> {
    const inventory = { ...character.inventory };

    inventory.backpack.items = inventory.backpack.items.filter((i) => i.id !== backpackItem.id)!;

    await this.prismaService.character.update({
      where: { id: character.id },
      data: { inventory: inventory as unknown as InputJsonObject },
    });

    this.charactersGateway.handleDownDestroyItem(campaign.id, character.id, backpackItem.id);
  }
}
