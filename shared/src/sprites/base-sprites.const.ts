import { FloorSpritePaths } from './floor-sprites.const.js';
import { WaterSpritePaths } from './water-sprites.const.js';

export const BaseSpritePaths = [...FloorSpritePaths, ...WaterSpritePaths] as const;

export type BaseSpritePath = (typeof BaseSpritePaths)[number];
