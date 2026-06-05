import { Klass } from '@hw/prismagen/browser';
import { inventoryItems } from '../../../inventory/inventory-items.const.js';
import { HwInventory } from '../../../inventory/inventory.interface.js';

const HeroStartingInventory: Record<Klass, HwInventory> = {
  BARBARIAN: {
    gear: {
      arms: null,
      body: null,
      cloak: null,
      feet: null,
      head: null,
      onehanded: { id: '', name: 'broadsword' },
      shield: null,
      twohanded: null,
    },
    backpack: { gold: 0, items: [] },
  },
  DWARF: {
    gear: {
      arms: null,
      body: null,
      cloak: null,
      feet: null,
      head: null,
      onehanded: { id: '', name: 'shortsword' },
      shield: null,
      twohanded: null,
    },
    backpack: { gold: 0, items: [{ id: '', name: 'toolkit' }] },
  },
  ELF: {
    gear: {
      arms: null,
      body: null,
      cloak: null,
      feet: null,
      head: null,
      onehanded: { id: '', name: 'shortsword' },
      shield: null,
      twohanded: null,
    },
    backpack: { gold: 0, items: [] },
  },
  WIZARD: {
    gear: {
      arms: null,
      body: null,
      cloak: null,
      feet: null,
      head: null,
      onehanded: { id: '', name: 'dagger' },
      shield: null,
      twohanded: null,
    },
    backpack: { gold: 0, items: [] },
  },
};

export const heroStartingInventory = (klass: Klass): HwInventory => {
  const inventory = { ...HeroStartingInventory[klass] };

  inventoryItems(inventory).forEach((item) => {
    item.id = crypto.randomUUID();
  });

  return inventory;
};
