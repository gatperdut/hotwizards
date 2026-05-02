import { Prisma } from '@hw/prismagen/client';
import { HwAdventure } from '@hw/shared';
import { adventureTemplateToHwAdventureTemplate } from '../adventures-templates/adventure-template-to-hw-adventure-template.js';

export const AdventureHwRelations = {
  include: {
    template: true,
  },
} satisfies Prisma.AdventureDefaultArgs;

type AdventureWithHwRelations = Prisma.AdventureGetPayload<typeof AdventureHwRelations>;

export const adventureToHwAdventure = (adventure: AdventureWithHwRelations): HwAdventure => {
  return {
    id: adventure.id,
    campaignId: adventure.campaignId as number,
    templateId: adventure.templateId,
    template: adventureTemplateToHwAdventureTemplate(adventure.template),
    turn: adventure.turn,
  };
};
