import { HwAdventureTemplate } from '../adventure-templates/adventure-template.interface.js';
import { HwDungeon } from '../dungeon/dungeon.interface.js';

export interface HwAdventure {
  id: number;
  campaignId: number;
  templateId: number;
  template: HwAdventureTemplate;
  turn: number;
  dungeon: HwDungeon;
}
