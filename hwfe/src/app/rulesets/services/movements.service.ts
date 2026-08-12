import { Injectable } from '@angular/core';
import { Movement } from '@hw/prismagen/enums';

@Injectable({ providedIn: 'root' })
export class MovementsService {
  public name(movement: Movement): string {
    switch (movement) {
      case 'REGULAR':
        return 'Regular';
      case 'BALANCED':
        return 'Balanced';
    }
  }
}
