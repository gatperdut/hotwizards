import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwCampaign,
  HwCampaignEditDto,
  HwCampaignSearchDto,
  HwMembershipCreateDto,
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

  public create(params: HwCampaignEditDto): Observable<number> {
    return this.httpClient
      .post<number>('/api/campaigns', params)
      .pipe(
        this.apiNotificationService.notify('Campaign created', 'Campaign could not be created'),
      );
  }

  public invite(id: number, params: HwMembershipCreateDto): Observable<number[]> {
    return this.httpClient
      .post<number[]>(`/api/campaigns/${id}/memberships`, params)
      .pipe(
        this.apiNotificationService.notify('Invitations sent', 'Invitations could not be sent'),
      );
  }

  public update(id: number, params: HwCampaignEditDto): Observable<number> {
    return this.httpClient
      .patch<number>(`/api/campaigns/${id}`, params)
      .pipe(
        this.apiNotificationService.notify('Campaign updated', 'Campaign could not be updated'),
      );
  }

  public delete(id: number): Observable<number> {
    return this.httpClient
      .delete<number>(`/api/campaigns/${id}`)
      .pipe(
        this.apiNotificationService.notify('Campaign deleted', 'Campaign could not be deleted'),
      );
  }
}
