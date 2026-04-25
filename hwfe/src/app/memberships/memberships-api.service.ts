import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwMembershipAcceptDto, HwMembershipCreateDto, HwMembershipDeleteDto } from '@hw/shared';
import { Observable } from 'rxjs';
import { ApiNotificationService } from '../services/api-notification.service';

@Injectable({ providedIn: 'root' })
export class MembershipsApiService {
  private httpClient = inject(HttpClient);
  private apiNotificationService = inject(ApiNotificationService);

  public invite(params: HwMembershipCreateDto): Observable<number[]> {
    return this.httpClient
      .post<number[]>('/api/memberships', params)
      .pipe(
        this.apiNotificationService.notify('Invitations sent', 'Invitations could not be sent'),
      );
  }

  public accept(params: HwMembershipAcceptDto): Observable<number> {
    return this.httpClient.post<number>('/api/memberships/accept', params);
  }

  public delete(params: HwMembershipDeleteDto): Observable<number> {
    return this.httpClient
      .delete<number>('/api/memberships', {
        params: { ...params },
      })
      .pipe(
        this.apiNotificationService.notify(
          'Removed from campaign',
          'Could not remove from campaign',
        ),
      );
  }
}
