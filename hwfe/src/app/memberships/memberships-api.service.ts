import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwMembershipAcceptDto, HwMembershipCreateDto } from '@hw/shared';
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

  public accept(id: number, params: HwMembershipAcceptDto): Observable<number> {
    return this.httpClient
      .patch<number>(`/api/memberships/${id}`, params)
      .pipe(
        this.apiNotificationService.notify(
          'Accepted invitation to join the campaign',
          'Could not accept invitation to join the campaign',
        ),
      );
  }

  public delete(id: number): Observable<number> {
    return this.httpClient
      .delete<number>(`/api/memberships/${id}`, {})
      .pipe(
        this.apiNotificationService.notify(
          'Removed from campaign',
          'Could not remove from campaign',
        ),
      );
  }
}
