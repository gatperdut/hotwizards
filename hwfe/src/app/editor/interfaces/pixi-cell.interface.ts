import { HwCell } from '@hw/shared/editor';
import { Sprite } from 'pixi.js';
import { HwPixiCorners } from './pixi-corners.interface';

export interface HwPixiCell extends HwCell {
  pixi: {
    baseSprite: Sprite;
    featureSprite: Sprite | null;
    featureTrapSprite: Sprite | null;
    doorSprite: Sprite | null;
    monsterSprite: Sprite | null;
    floorTrapSprite: Sprite | null;
    stairsSprite: Sprite | null;
    corners: HwPixiCorners;
    spawnSprite: Sprite | null;
  };
}
