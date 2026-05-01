import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HwCampaign } from '@hw/shared';

@Injectable()
export class CampaignService {
  public campaign = signal<HwCampaign>(null!);

  constructor() {
    inject(DestroyRef).onDestroy(() => console.log('CampaignService destroyed'));
  }
}
