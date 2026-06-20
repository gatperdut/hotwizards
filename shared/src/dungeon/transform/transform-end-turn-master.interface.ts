export interface HwTransformEndTurnMasterMonster {
  actionPoints: number;
  movementPoints: number;
}

export interface HwTransformEndTurnMaster {
  monsters: Record<number, HwTransformEndTurnMasterMonster>;
}
