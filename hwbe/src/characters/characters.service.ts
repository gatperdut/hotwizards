import { InputJsonObject, InputJsonValue } from '@hw/prismagen/runtime';
import { HwCampaign } from '@hw/shared/campaigns';
import {
  buyItem,
  dropItem,
  equipItem,
  giveGold,
  HwCharacter,
  pickupGold,
  pickupItem,
  sellItem,
  unequipItem,
} from '@hw/shared/characters';
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
    dropItem(campaign, character, backpackItem.id);

    await this.prismaService.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { inventory: character.inventory as unknown as InputJsonObject },
      });

      return tx.campaign.update({
        where: { id: campaign.id },
        data: {
          stash: campaign.stash as unknown as InputJsonObject,
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
    pickupItem(campaign, character, stashItem.id);

    await this.prismaService.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { inventory: character.inventory as unknown as InputJsonObject },
      });

      return tx.campaign.update({
        where: { id: campaign.id },
        data: {
          stash: campaign.stash as unknown as InputJsonObject,
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
    pickupGold(campaign, character, amount);
    await this.prismaService.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { inventory: character.inventory as unknown as InputJsonObject },
      });

      return tx.campaign.update({
        where: { id: campaign.id },
        data: {
          stash: campaign.stash as unknown as InputJsonObject,
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
    if (character.inventory.backpack.gold < HwItemCosts[buyableItemName]) {
      throw new UnprocessableEntityException(`Insufficient gold to buy ${buyableItemName}`);
    }

    const boughtItem = { id: crypto.randomUUID(), name: buyableItemName };
    buyItem(character, boughtItem);

    await this.prismaService.character.update({
      where: { id: character.id },
      data: { inventory: character.inventory as unknown as InputJsonObject },
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

    sellItem(character, backpackItem.id);

    await this.prismaService.character.update({
      where: { id: character.id },
      data: { inventory: character.inventory as unknown as InputJsonObject },
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

    giveGold(campaign, character, targetCharacter, amount);

    await this.prismaService.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { inventory: character.inventory as unknown as InputJsonObject },
      });

      return tx.character.update({
        where: { id: targetCharacter.id },
        data: {
          inventory: targetCharacter.inventory as unknown as InputJsonObject,
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
