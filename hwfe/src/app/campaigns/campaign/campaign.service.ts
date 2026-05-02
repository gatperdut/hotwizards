import { Injectable, signal } from '@angular/core';
import { HwCampaign } from '@hw/shared';

@Injectable()
export class CampaignService {
  public campaign = signal<HwCampaign>(null!);

  public start(adventureTemplateId: number): void {
    console.log('START!');
  }
}
