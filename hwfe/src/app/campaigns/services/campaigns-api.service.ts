import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwCampaign } from '@hw/shared';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CampaignsApiService {
  private httpClient = inject(HttpClient);

  public mine(): Observable<HwCampaign[]> {
    return this.httpClient.get<HwCampaign[]>('/api/campaigns/mine');
  }
}
