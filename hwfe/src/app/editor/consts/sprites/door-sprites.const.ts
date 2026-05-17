import { DoorSpritePath, SpriteOffset } from '@hw/shared/sprites';

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
