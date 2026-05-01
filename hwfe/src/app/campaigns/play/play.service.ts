import { Injectable, signal } from '@angular/core';
import { HwCampaign } from '../../../../../shared/dist/shared/src/campaigns/campaign.interface';

@Injectable()
export class PlayService {
  public campaign = signal<HwCampaign>(null!);
}
