import { HwItem } from '../inventory/item.interface.js';
import { HwSlot } from '../inventory/slots.const.js';

export interface CharactersDownstream {
  downEquipItem: (characterId: number, backpackItemId: string) => void;
  downUnequipItem: (characterId: number, slot: HwSlot) => void;
  downDropItem: (characterId: number, backpackItemId: string) => void;
  downPickupItem: (characterId: number, stashItemId: string) => void;
  downPickupGold: (characterId: number, amount: number) => void;
  downBuyItem: (characterId: number, boughtItem: HwItem) => void;
  downSellItem: (characterId: number, soldItemId: string) => void;
}
