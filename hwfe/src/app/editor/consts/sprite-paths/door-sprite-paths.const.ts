import { SpriteOffset } from '../../types/sprite-offset.type';

export const OpenDoorSpritePaths = [
  '/tiles/door/open_door_x.png',
  '/tiles/door/open_door_y.png',
] as const;

export const ClosedDoorSpritePaths = [
  '/tiles/door/closed_door_x.png',
  '/tiles/door/closed_door_y.png',
] as const;

export const DoorSpritePaths = [...OpenDoorSpritePaths, ...ClosedDoorSpritePaths] as const;

export type OpenDoorSpritePath = (typeof OpenDoorSpritePaths)[number];
export type ClosedDoorSpritePath = (typeof ClosedDoorSpritePaths)[number];
export type DoorSpritePath = (typeof DoorSpritePaths)[number];

export const DoorSpriteSizes: Record<DoorSpritePath, SpriteOffset> = {
  '/tiles/door/open_door_x.png': { x: 37, y: 91 },
  '/tiles/door/open_door_y.png': { x: 37, y: 91 },
  '/tiles/door/closed_door_x.png': { x: 37, y: 91 },
  '/tiles/door/closed_door_y.png': { x: 37, y: 91 },
} as const;

export const DoorSpriteOffsets: Record<DoorSpritePath, SpriteOffset> = {
  '/tiles/door/open_door_x.png': { x: -1, y: -50 },
  '/tiles/door/open_door_y.png': { x: -1, y: -50 },
  '/tiles/door/closed_door_x.png': { x: -1, y: -50 },
  '/tiles/door/closed_door_y.png': { x: -1, y: -50 },
} as const;
