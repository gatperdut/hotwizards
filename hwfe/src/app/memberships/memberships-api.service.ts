import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwMembership,
  HwMembershipAcceptDto,
  HwMembershipAcceptResponse,
  HwMembershipCreateDto,
  HwMembershipCreateResponse,
  HwMembershipsByIdsDto,
} from '@hw/shared';
import { Observable, of } from 'rxjs';
import { ApiNotificationService } from '../services/api-notification.service';

@Injectable({ providedIn: 'root' })
export class MembershipsApiService {
  private httpClient = inject(HttpClient);
  private apiNotificationService = inject(ApiNotificationService);

  public get(params: HwMembershipsByIdsDto): Observable<HwMembership[]> {
    if (!params.ids.length) {
      return of([]);
    }

    return this.httpClient.get<HwMembership[]>('/api/memberships/by-ids', {
      params: { ...params },
    });
  }

  public invite(params: HwMembershipCreateDto): Observable<HwMembershipCreateResponse> {
    return this.httpClient
      .post<HwMembershipCreateResponse>('/api/memberships', params)
      .pipe(
        this.apiNotificationService.notify('Invitations sent', 'Invitations could not be sent'),
      );
  }

  public accept(params: HwMembershipAcceptDto) {
    return this.httpClient.post<HwMembershipAcceptResponse>('/api/memberships/accept', params);
  }
}
