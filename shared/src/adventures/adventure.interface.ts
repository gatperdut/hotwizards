import { HwAdventureTemplate } from '../adventure-templates/adventure-template.interface.js';

export interface HwAdventure {
  id: number;
  template: HwAdventureTemplate;
  turn: number;
}
