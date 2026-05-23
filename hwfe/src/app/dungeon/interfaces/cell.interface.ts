import { HwCell } from '@hw/shared/dungeon';
import { Sprite } from 'pixi.js';
import { HwfeCorners } from './corners.interface';

export interface HwfeCell extends HwCell {
  pixi: {
    baseSprite: Sprite;
    featureSprite: Sprite | null;
    doorSprite: Sprite | null;
    floorTrapSprite: Sprite | null;
    stairsSprite: Sprite | null;
    corners: HwfeCorners;
  };
}
