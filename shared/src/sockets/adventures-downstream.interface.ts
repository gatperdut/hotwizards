import { HwDungeonTransformData } from '../dungeon/dungeon-transform-data.interface.js';

export interface AdventuresDownstream {
  downFinishAdventure: () => void;
  downNextTurn: (data: HwDungeonTransformData) => void;
  downUpdate: (data: HwDungeonTransformData) => void;
}
