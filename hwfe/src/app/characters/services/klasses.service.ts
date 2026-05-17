import { Injectable } from '@angular/core';
import { Klass } from '@hw/prismagen/browser';

@Injectable({ providedIn: 'root' })
export class KlassesService {
  public name(klass: Klass): string {
    switch (klass) {
      case 'BARBARIAN':
        return 'Barbarian';
      case 'DWARF':
        return 'Dwarf';
      case 'ELF':
        return 'Elf';
      case 'WIZARD':
        return 'Wizard';
    }
  }
}
