import { HwCell } from '@hw/shared/dungeon';
import { Sprite } from 'pixi.js';

export interface HwfeCell extends HwCell {
  pixi: {
    baseSprite: Sprite;
  };
}
