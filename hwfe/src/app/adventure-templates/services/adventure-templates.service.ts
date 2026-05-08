import { Injectable } from '@angular/core';
import { HwAdventureTemplate } from '@hw/shared';

@Injectable({ providedIn: 'root' })
export class AdventureTemplatesService {
  public empty(): HwAdventureTemplate {
    return {
      name: 'New Adventure Template',
    } as HwAdventureTemplate;
  }
}
