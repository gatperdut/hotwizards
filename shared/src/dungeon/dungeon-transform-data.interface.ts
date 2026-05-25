import { HwCell } from './cells/cell.interface.js';
import { HwCreature } from './creatures/creature.interface.js';

export interface HwDungeonTransformData {
  modifiedCreatures: HwCreature[];
  modifiedCells: HwCell[];
}
