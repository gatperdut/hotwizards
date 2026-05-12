export const MonsterSpritePaths = [
  '/tiles/monsters/goblin_1_n.png',
  '/tiles/monsters/goblin_1_e.png',
  '/tiles/monsters/goblin_1_s.png',
  '/tiles/monsters/goblin_1_w.png',
  '/tiles/monsters/goblin_2_n.png',
  '/tiles/monsters/goblin_2_e.png',
  '/tiles/monsters/goblin_2_s.png',
  '/tiles/monsters/goblin_2_w.png',
  '/tiles/monsters/goblin_3_n.png',
  '/tiles/monsters/goblin_3_e.png',
  '/tiles/monsters/goblin_3_s.png',
  '/tiles/monsters/goblin_3_w.png',
] as const;

export type MonsterSpritePath = (typeof MonsterSpritePaths)[number];
