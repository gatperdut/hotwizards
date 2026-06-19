import { HwInventory } from '../../inventory/inventory.interface.js';
import { CreatureSpritePath } from '../../sprites/creature-sprites.const.js';
import { HwAlignment } from './alignment.const.js';

export interface HwCreature {
  id: number;
  alignment: HwAlignment;
  x: number;
  y: number;
  name: string;
  spritePath: CreatureSpritePath;
  movementPoints: number;
  maxMovementPoints: number;
  attackDie: number;
  defendDie: number;
  bodyPoints: number;
  mindPoints: number;
  inventory: HwInventory;
}
