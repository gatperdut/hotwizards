import { HwDungeon } from '../editor/dungeon.interface.js';

export interface HwAdventureTemplate {
  id: number;
  name: string;
  dungeon: HwDungeon;
}
