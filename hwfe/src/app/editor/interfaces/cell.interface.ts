import { HwCell } from '@hw/shared';
import { Sprite } from 'pixi.js';

export interface HwCellPixi extends HwCell {
  pixi: {
    sprite: Sprite;
  };
}
