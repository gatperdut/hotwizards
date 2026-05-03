export interface AdventuresDownstream {
  downFinishAdventure: (campaignId: number, adventureTemplateName: string) => void;
  downNextTurn: (campaignId: number, turn: number) => void;
}
