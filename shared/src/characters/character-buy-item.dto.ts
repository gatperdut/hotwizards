import { IsIn } from 'class-validator';
import { HwBuyableItemName, HwBuyableItemNames } from '../inventory/item-names.const.js';

export class HwCharacterBuyItemDto {
  @IsIn(HwBuyableItemNames)
  buyableItemName: HwBuyableItemName;
}
