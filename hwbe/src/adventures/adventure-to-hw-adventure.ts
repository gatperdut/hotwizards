import { Prisma } from '@hw/prismagen/client';
import { HwAdventure } from '@hw/shared/adventures';
import { HwDungeon } from '@hw/shared/dungeon';
import { adventureTemplateToHwAdventureTemplate } from '../adventures-templates/adventure-template-to-hw-adventure-template.js';

export const AdventureHwRelations = {
  include: {
    template: true,
  },
} satisfies Prisma.AdventureDefaultArgs;

type AdventureWithHwRelations = Prisma.AdventureGetPayload<typeof AdventureHwRelations>;

export const adventureToHwAdventure = (
  adventure: AdventureWithHwRelations,
  userId: number,
): HwAdventure => {
  const dungeon = adventure.dungeon as unknown as HwDungeon;

  return {
    id: adventure.id,
    campaignId: adventure.campaignId as number,
    templateId: adventure.templateId,
    template: adventureTemplateToHwAdventureTemplate(adventure.template),
    turn: adventure.turn,
    dungeon: {
      ...dungeon,
      heroes: dungeon.heroes.map((hero) => ({
        ...hero,
        me: hero.id === userId,
      })),
    },
  };
};
