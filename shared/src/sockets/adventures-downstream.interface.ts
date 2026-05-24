import { HwDungeon } from '../dungeon/dungeon.interface.js';

export interface AdventuresDownstream {
  downFinishAdventure: () => void;
  downNextTurn: (turn: number) => void;
  downUpdate: (dungeon: HwDungeon) => void;
}
