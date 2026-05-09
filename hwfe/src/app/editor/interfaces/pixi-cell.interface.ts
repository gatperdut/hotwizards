import { HwCell } from '@hw/shared';
import { Sprite } from 'pixi.js';

export interface HwPixiCell extends HwCell {
  pixi: {
    groundSprite: Sprite;
  };
}
