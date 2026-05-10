import { HwCell } from '@hw/shared';
import { Sprite } from 'pixi.js';

export interface HwPixiCell extends HwCell {
  pixi: {
    baseSprite: Sprite;
    featureSprite: Sprite | null;
    doorSprite: Sprite | null;
  };
}
