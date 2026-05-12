import { HwMonster } from './monster.interface.js';

export interface HwCell {
  x: number;
  y: number;
  // TODO don't use strings, move sprite paths to shared?!
  baseSpritePath: string;
  featureSpritePath: string | null;
  doorSpritePath: string | null;
  monster: HwMonster;
  traversable: boolean;
  spawn: boolean;
}
