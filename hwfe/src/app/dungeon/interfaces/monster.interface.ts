import { HwMonster } from '@hw/shared/dungeon';
import { Sprite } from 'pixi.js';

export interface HwfeMonster extends HwMonster {
  pixi: {
    sprite: Sprite;
  };
}
