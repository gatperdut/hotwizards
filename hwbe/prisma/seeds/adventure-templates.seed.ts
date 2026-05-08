import { PrismaClient } from '@hw/prismagen/client';
import { HwCell } from '@hw/shared';
import { InputJsonValue } from '@prisma/client/runtime/client';

export async function seedAdventureTemplates(prismaClient: PrismaClient): Promise<void> {
  const sunkenTombCells: HwCell[] = [
    {
      x: 5,
      y: 2,
      sprite: '/tiles/ground/ground_01.png',
    },
    {
      x: 6,
      y: 2,
      sprite: '/tiles/ground/ground_02.png',
    },
    {
      x: 5,
      y: 3,
      sprite: '/tiles/ground/ground_03.png',
    },
    {
      x: 6,
      y: 3,
      sprite: '/tiles/ground/ground_04.png',
    },
  ];

  await prismaClient.adventureTemplate.createMany({
    data: [
      { name: 'The Sunken Tomb', dungeon: { cells: sunkenTombCells as unknown as InputJsonValue } },
      { name: 'Raid on Blackmoor Keep', dungeon: { cells: [] } },
    ],
  });
}
