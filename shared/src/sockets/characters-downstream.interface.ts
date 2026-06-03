import { HwSlot } from '../inventory/slots.const.js';

export interface CharactersDownstream {
  downEquipItem: (characterId: number, backpackItemId: string) => void;
  downUnequipItem: (characterId: number, slot: HwSlot) => void;
}
