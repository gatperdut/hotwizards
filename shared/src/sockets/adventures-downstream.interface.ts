export interface AdventuresDownstream {
  downFinishAdventure: (campaignId: number, adventureTemplateName: string) => void;
  downNextTurn: (turn: number) => void;
}
