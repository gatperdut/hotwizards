import { User } from '@hw/prismagen/client';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { HwAdventure } from '@hw/shared/adventures';
import { HwCampaign } from '@hw/shared/campaigns';
import { HwCharacter } from '@hw/shared/characters';
import { HwHero, HwMonster } from '@hw/shared/dungeon';
import { HwItem } from '@hw/shared/inventory';
import { HwMembership } from '@hw/shared/memberships';
import { Request } from 'express';

export type HwRequest = Request & {
  user: User;
  campaign: HwCampaign;
  membership: HwMembership;
  character: HwCharacter;
  adventure: HwAdventure;
  adventureTemplate: HwAdventureTemplate;
  hero: HwHero;
  monster: HwMonster;
  backpackItem: HwItem;
  lootItem: HwItem;
  gearItem: HwItem;
  stashItem: HwItem;
  targetCharacter: HwCharacter;
};
