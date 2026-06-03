import { HwCampaign } from '@hw/shared/campaigns';
import { HwCharacter } from '@hw/shared/characters';
import { HwItem, HwSlot } from '@hw/shared/inventory';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CharactersGateway } from './characters.gateway.js';

@Injectable()
export class CharactersService {
  constructor(
    private prismaService: PrismaService,
    private charactersGateway: CharactersGateway,
  ) {}

  // TODO return Promise<void>
  public equipItem(campaign: HwCampaign, character: HwCharacter, backpackItem: HwItem): void {
    this.charactersGateway.handleDownEquipItem(campaign.id, character.id, backpackItem.id);

    console.log(campaign, character, backpackItem);
  }

  // TODO return Promise<void>
  public unequipItem(campaign: HwCampaign, character: HwCharacter, slot: HwSlot): void {
    this.charactersGateway.handleDownEquipItem(campaign.id, character.id, slot);
    console.log(campaign, character, slot);
  }
}
