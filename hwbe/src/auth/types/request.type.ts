import { User } from '@hw/prismagen/client';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { HwAdventure } from '@hw/shared/adventures';
import { HwCampaign } from '@hw/shared/campaigns';
import { HwHero, HwMonster } from '@hw/shared/dungeon';
import { HwMembership } from '@hw/shared/memberships';
import { Request } from 'express';

export type HwRequest = Request & {
  user: User;
  campaign: HwCampaign;
  membership: HwMembership;
  adventure: HwAdventure;
  adventureTemplate: HwAdventureTemplate;
  hero: HwHero;
  monster: HwMonster;
};
