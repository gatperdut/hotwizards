import { HwEditorCell } from '@hw/shared/editor';
import { Sprite } from 'pixi.js';
import { HwfeEditorCorners } from './editor-corners.interface';

export interface HwfeEditorCell extends HwEditorCell {
  pixi: {
    baseSprite: Sprite;
    featureSprite: Sprite | null;
    featureTrapSprite: Sprite | null;
    doorSprite: Sprite | null;
    monsterSprite: Sprite | null;
    floorTrapSprite: Sprite | null;
    stairsSprite: Sprite | null;
    corners: HwfeEditorCorners;
    spawnSprite: Sprite | null;
  };
}
