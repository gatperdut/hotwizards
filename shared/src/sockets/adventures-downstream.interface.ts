export interface AdventuresDownstream {
  downFinishAdventure: () => void;
  downNextTurn: (turn: number) => void;
}
