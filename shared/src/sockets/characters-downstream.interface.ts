import { HwSlot } from '../inventory/slots.const.js';

export interface CharactersDownstream {
  downEquipItem: (campaignId: number, characterId: number, backpackItemId: string) => void;
  downUnequipItem: (campaignId: number, characterId: number, slot: HwSlot) => void;
}
