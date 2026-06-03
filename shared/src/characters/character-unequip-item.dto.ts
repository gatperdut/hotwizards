import { IsIn } from 'class-validator';
import { HwSlot, HwSlots } from '../inventory/slots.const.js';

export class HwCharacterUnequipItemDto {
  @IsIn(HwSlots)
  slot: HwSlot;
}
