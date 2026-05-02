import { HwAdventureTemplate } from '../adventure-templates/adventure-template.interface.js';

export interface HwAdventure {
  id: number;
  campaignId: number;
  templateId: number;
  template: HwAdventureTemplate;
  turn: number;
}
