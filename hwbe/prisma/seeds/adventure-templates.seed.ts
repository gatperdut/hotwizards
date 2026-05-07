import { PrismaClient } from '@hw/prismagen/client';

export async function seedAdventureTemplates(prismaClient: PrismaClient): Promise<void> {
  await prismaClient.adventureTemplate.createMany({
    data: [
      { name: 'The Sunken Tomb', map: { cells: [] } },
      { name: 'Raid on Blackmoor Keep', map: { cells: [] } },
    ],
  });
}
