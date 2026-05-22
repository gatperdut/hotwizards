import { HwHero } from '@hw/shared/dungeon';
import { Sprite } from 'pixi.js';

export interface HwfeHero extends HwHero {
  pixi: {
    sprite: Sprite;
  };
}
