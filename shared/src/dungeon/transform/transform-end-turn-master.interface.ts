export interface HwTransformEndTurnMasterMonster {
  movementPoints: number;
}

export interface HwTransformEndTurnMaster {
  monsters: Record<number, HwTransformEndTurnMasterMonster>;
}
