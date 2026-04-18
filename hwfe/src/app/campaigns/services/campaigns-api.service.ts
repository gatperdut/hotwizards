import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwCampaign, HwCampaignSearchDto, Paginated } from '@hw/shared';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CampaignsApiService {
  private httpClient = inject(HttpClient);

  public mine(dto: HwCampaignSearchDto): Observable<Paginated<HwCampaign>> {
    const params: Partial<HwCampaignSearchDto> = {};

    if (dto.term) {
      params.term = dto.term;
    }

    if (dto.page) {
      params.page = dto.page;
    }

    if (dto.pageSize) {
      params.pageSize = dto.pageSize;
    }

    return this.httpClient.get<Paginated<HwCampaign>>('/api/campaigns/mine', {
      params: { ...params },
    });
  }
}
