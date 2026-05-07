import { Injectable } from '@angular/core';
import { HwAdventureTemplate } from '../../../../../shared/dist/shared/src/adventure-templates/adventure-template.interface';

@Injectable({ providedIn: 'root' })
export class AdventureTemplatesService {
  public empty(): HwAdventureTemplate {
    return {
      name: 'New Adventure Template',
    } as HwAdventureTemplate;
  }
}
