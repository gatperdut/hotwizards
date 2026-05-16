import { Prisma } from '@hw/prismagen/client';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { HwDungeon } from '@hw/shared/editor';

export const AdventureTemplateHwRelations = {
  include: {},
} satisfies Prisma.AdventureTemplateDefaultArgs;

type AdventureTemplateWithHwRelations = Prisma.AdventureTemplateGetPayload<
  typeof AdventureTemplateHwRelations
>;

export const adventureTemplateToHwAdventureTemplate = (
  adventureTemplate: AdventureTemplateWithHwRelations,
): HwAdventureTemplate => {
  return {
    id: adventureTemplate.id,
    name: adventureTemplate.name,
    info: adventureTemplate.info,
    dungeon: adventureTemplate.dungeon as unknown as HwDungeon,
  };
};
