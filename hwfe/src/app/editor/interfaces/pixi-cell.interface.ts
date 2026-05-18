import { HwCell } from '@hw/shared/editor';
import { Sprite } from 'pixi.js';

export interface HwPixiCell extends HwCell {
  pixi: {
    baseSprite: Sprite;
    featureSprite: Sprite | null;
    featureTrapSprite: Sprite | null;
    doorSprite: Sprite | null;
    monsterSprite: Sprite | null;
    floorTrapSprite: Sprite | null;
    stairsSprite: Sprite | null;
    spawnSprite: Sprite | null;
  };
}
