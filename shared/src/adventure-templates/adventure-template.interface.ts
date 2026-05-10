import { HwDungeon } from '../editor/dungeon.interface.js';

export interface HwAdventureTemplate {
  id: number;
  name: string;
  info: string;
  dungeon: HwDungeon;
}
