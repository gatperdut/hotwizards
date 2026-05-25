import { HwDungeonTransformData } from '../dungeon/dungeon-transform-data.interface.js';

export interface AdventuresDownstream {
  downFinishAdventure: () => void;
  downNextTurn: (turn: number) => void;
  downUpdate: (data: HwDungeonTransformData) => void;
}
