import { Prisma } from '@hw/prismagen/client';
import { HwRuleset } from '@hw/shared';

export const RulesetHwRelations = {
  include: {},
} satisfies Prisma.RulesetDefaultArgs;

type RulesetWithHwRelations = Prisma.RulesetGetPayload<typeof RulesetHwRelations>;

export const rulesetToHwRuleset = (ruleset: RulesetWithHwRelations): HwRuleset => {
  return {
    id: ruleset.id,
    campaignId: ruleset.campaignId,
    aoo: ruleset.aoo,
    movement: ruleset.movement,
  };
};
