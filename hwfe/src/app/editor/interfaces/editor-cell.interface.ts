import { HwEditorCell } from '@hw/shared/editor';
import { Sprite } from 'pixi.js';
import { HwfeCorners } from './corners.interface';

export interface HwfeEditorCell extends HwEditorCell {
  pixi: {
    baseSprite: Sprite;
    featureSprite: Sprite | null;
    featureTrapSprite: Sprite | null;
    doorSprite: Sprite | null;
    monsterSprite: Sprite | null;
    floorTrapSprite: Sprite | null;
    stairsSprite: Sprite | null;
    corners: HwfeCorners;
    spawnSprite: Sprite | null;
  };
}
