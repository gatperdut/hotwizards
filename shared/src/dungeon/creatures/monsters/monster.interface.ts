import { HwCreature } from '../creature.interface.js';
import { MonsterType } from './monster-type.const.js';

export interface HwMonster extends HwCreature {
  alignment: 'MONSTER';
  type: MonsterType | null;
}
