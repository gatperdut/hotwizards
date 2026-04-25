import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwCampaign,
  HwCampaignCreateDto,
  HwCampaignDeleteDto,
  HwCampaignSearchDto,
  HwCampaignUpdateDto,
  Paginated,
} from '@hw/shared';
import { Observable } from 'rxjs';
import { ApiNotificationService } from '../../services/api-notification.service';

@Injectable({ providedIn: 'root' })
export class CampaignsApiService {
  private httpClient = inject(HttpClient);
  private apiNotificationService = inject(ApiNotificationService);

  public search(dto: HwCampaignSearchDto): Observable<Paginated<HwCampaign>> {
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

    return this.httpClient.get<Paginated<HwCampaign>>('/api/campaigns', {
      params: { ...params },
    });
  }

  public create(params: HwCampaignCreateDto): Observable<number> {
    return this.httpClient
      .post<number>('/api/campaigns', params)
      .pipe(
        this.apiNotificationService.notify('Campaign created', 'Campaign could not be created'),
      );
  }

  public update(params: HwCampaignUpdateDto): Observable<number> {
    return this.httpClient
      .patch<number>('/api/campaigns', params)
      .pipe(
        this.apiNotificationService.notify('Campaign updated', 'Campaign could not be updated'),
      );
  }

  public delete(params: HwCampaignDeleteDto): Observable<number> {
    return this.httpClient
      .delete<number>('/api/campaigns', {
        params: { ...params },
      })
      .pipe(
        this.apiNotificationService.notify('Campaign deleted', 'Could not delete the campaign'),
      );
  }
}
