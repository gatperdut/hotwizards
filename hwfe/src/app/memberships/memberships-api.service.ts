import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwMembershipAcceptDto } from '@hw/shared';
import { Observable } from 'rxjs';
import { ApiNotificationService } from '../services/api-notification.service';

@Injectable({ providedIn: 'root' })
export class MembershipsApiService {
  private httpClient = inject(HttpClient);
  private apiNotificationService = inject(ApiNotificationService);

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

  public kickout(id: number): Observable<number> {
    return this.httpClient
      .delete<number>(`/api/memberships/${id}`, {})
      .pipe(
        this.apiNotificationService.notify(
          'Removed from campaign',
          'Could not remove from campaign',
        ),
      );
  }

  public abandon(id: number): Observable<number> {
    return this.httpClient
      .delete<number>(`/api/memberships/${id}/self`, {})
      .pipe(this.apiNotificationService.notify('Campaign abandoned', 'Could not abandon campaign'));
  }
}
