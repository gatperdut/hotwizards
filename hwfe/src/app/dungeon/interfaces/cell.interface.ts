import { HwCell } from '@hw/shared/dungeon';
import { Sprite } from 'pixi.js';

export interface HwfeCell extends HwCell {
  pixi: {
    baseSprite: Sprite;
    featureSprite: Sprite | null;
    doorSprite: Sprite | null;
    floorTrapSprite: Sprite | null;
  };
}
