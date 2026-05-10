import { SpriteOffset } from '../../types/sprite-offset.type';
import { FloorSpritePaths } from './floor-sprite-paths.const';
import { WaterSpritePaths } from './water-sprite-paths.const';

export const BaseSpritePaths = [...FloorSpritePaths, ...WaterSpritePaths] as const;

export type BaseSpritePath = (typeof BaseSpritePaths)[number];

export const BaseSpriteSizes: Record<BaseSpritePath, SpriteOffset> = {
  '/tiles/floor/floor_01.png': { x: 64, y: 64 },
  '/tiles/floor/floor_02.png': { x: 64, y: 64 },
  '/tiles/floor/floor_03.png': { x: 64, y: 64 },
  '/tiles/floor/floor_04.png': { x: 64, y: 64 },
  '/tiles/floor/floor_05.png': { x: 64, y: 64 },
  '/tiles/floor/floor_06.png': { x: 64, y: 64 },
  '/tiles/floor/floor_07.png': { x: 64, y: 64 },
  '/tiles/floor/floor_08.png': { x: 64, y: 64 },
  '/tiles/floor/floor_09.png': { x: 64, y: 64 },
  '/tiles/floor/floor_10.png': { x: 64, y: 64 },
  '/tiles/floor/floor_11.png': { x: 64, y: 64 },
  '/tiles/floor/floor_12.png': { x: 64, y: 64 },
  '/tiles/water/water_01.png': { x: 64, y: 64 },
  '/tiles/water/water_02.png': { x: 64, y: 64 },
  '/tiles/water/water_03.png': { x: 64, y: 64 },
  '/tiles/water/water_04.png': { x: 64, y: 64 },
  '/tiles/water/water_05.png': { x: 64, y: 64 },
  '/tiles/water/water_06.png': { x: 64, y: 64 },
  '/tiles/water/water_07.png': { x: 64, y: 64 },
  '/tiles/water/water_08.png': { x: 64, y: 64 },
  '/tiles/water/water_09.png': { x: 64, y: 64 },
  '/tiles/water/water_10.png': { x: 64, y: 64 },
  '/tiles/water/water_11.png': { x: 64, y: 64 },
  '/tiles/water/water_12.png': { x: 64, y: 64 },
  '/tiles/water/water_13.png': { x: 64, y: 64 },
};

export const BaseSpriteOffsets: Record<BaseSpritePath, SpriteOffset> = {
  '/tiles/floor/floor_01.png': { x: 0, y: 0 },
  '/tiles/floor/floor_02.png': { x: 0, y: 0 },
  '/tiles/floor/floor_03.png': { x: 0, y: 0 },
  '/tiles/floor/floor_04.png': { x: 0, y: 0 },
  '/tiles/floor/floor_05.png': { x: 0, y: 0 },
  '/tiles/floor/floor_06.png': { x: 0, y: 0 },
  '/tiles/floor/floor_07.png': { x: 0, y: 0 },
  '/tiles/floor/floor_08.png': { x: 0, y: 0 },
  '/tiles/floor/floor_09.png': { x: 0, y: 0 },
  '/tiles/floor/floor_10.png': { x: 0, y: 0 },
  '/tiles/floor/floor_11.png': { x: 0, y: 0 },
  '/tiles/floor/floor_12.png': { x: 0, y: 0 },
  '/tiles/water/water_01.png': { x: 0, y: 0 },
  '/tiles/water/water_02.png': { x: 0, y: 0 },
  '/tiles/water/water_03.png': { x: 0, y: 0 },
  '/tiles/water/water_04.png': { x: 0, y: 0 },
  '/tiles/water/water_05.png': { x: 0, y: 0 },
  '/tiles/water/water_06.png': { x: 0, y: 0 },
  '/tiles/water/water_07.png': { x: 0, y: 0 },
  '/tiles/water/water_08.png': { x: 0, y: 0 },
  '/tiles/water/water_09.png': { x: 0, y: 0 },
  '/tiles/water/water_10.png': { x: 0, y: 0 },
  '/tiles/water/water_11.png': { x: 0, y: 0 },
  '/tiles/water/water_12.png': { x: 0, y: 0 },
  '/tiles/water/water_13.png': { x: 0, y: 0 },
};
