import { HwCell } from '@hw/shared/editor';
import { Sprite } from 'pixi.js';

export interface HwPixiCell extends HwCell {
  pixi: {
    baseSprite: Sprite;
    featureSprite: Sprite | null;
    doorSprite: Sprite | null;
    monsterSprite: Sprite | null;
  };
}
