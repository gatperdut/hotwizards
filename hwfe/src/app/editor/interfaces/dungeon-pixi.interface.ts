import { HwDungeon } from '@hw/shared';
import { HwCellPixi } from './cell-pixi.interface';

export interface HwDungeonPixi extends HwDungeon {
  cells: HwCellPixi[];
}
