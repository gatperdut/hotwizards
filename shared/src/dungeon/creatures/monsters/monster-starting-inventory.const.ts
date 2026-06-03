import { inventoryItems } from '../../../inventory/inventory-items.const.js';
import { HwInventory } from '../../../inventory/inventory.interface.js';
import { MonsterType } from './monster-type.const.js';

// TODO split by monstertype
const MonsterStartingInventory: HwInventory = {
  gear: {
    arms: null,
    body: null,
    cloak: null,
    feet: null,
    head: null,
    onehanded: { id: '', name: 'dagger' },
    shield: { id: '', name: 'shield' },
    twohanded: null,
  },
  backpack: [],
};

export const monsterStartingInventory = (monsterType: MonsterType): HwInventory => {
  const inventory = { ...MonsterStartingInventory };

  inventoryItems(inventory).forEach((item) => {
    item.id = crypto.randomUUID();
  });

  return inventory;
};
