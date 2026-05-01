import { Injectable, signal } from '@angular/core';
import { HwCampaign } from '../../../../../shared/dist/shared/src/campaigns/campaign.interface';

@Injectable()
export class CampaignService {
  public campaign = signal<HwCampaign>(null!);
}
