import { Injectable } from '@angular/core';
import { Gender, Klass } from '@hw/prismagen/enums';

@Injectable({ providedIn: 'root' })
export class KlassService {
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

  public portrait(klass: Klass, gender: Gender): string {
    return `/characters/${klass.toLowerCase()}_${gender.toLowerCase()}.png  `;
  }
}
