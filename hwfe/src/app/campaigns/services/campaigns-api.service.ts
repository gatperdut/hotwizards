import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwCampaign, HwCampaignSearchDto } from '@hw/shared';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CampaignsApiService {
  private httpClient = inject(HttpClient);

  public mine(dto: HwCampaignSearchDto): Observable<HwCampaign[]> {
    const params: Partial<HwCampaignSearchDto> = {};

    if (dto.term?.length > 1) {
      params.term = dto.term?.slice(0, 50);
    }

    return this.httpClient.get<HwCampaign[]>('/api/campaigns/mine', { params: params });
  }
}
