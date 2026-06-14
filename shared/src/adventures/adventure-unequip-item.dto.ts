import { IsIn } from 'class-validator';
import { HwSlot, HwSlots } from '../inventory/slots.const.js';

export class HwAdventureUnequipItemDto {
  @IsIn(HwSlots)
  slot: HwSlot;
}
