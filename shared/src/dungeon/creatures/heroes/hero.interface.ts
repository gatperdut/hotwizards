import { HeroSpritePath } from '../../../sprites/hero-sprites.const.js';
import { HwCreature } from '../creature.interface.js';

export interface HwHero extends HwCreature {
  alignment: 'HERO';
  spritePath: HeroSpritePath;
}
