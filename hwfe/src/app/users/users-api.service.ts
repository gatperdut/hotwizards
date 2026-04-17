import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwUser,
  HwUserExt,
  type UserAvailabilityEmailDto,
  type UserAvailabilityHandleDto,
  type UserAvailabilityResponse,
} from '@hw/shared';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private httpClient = inject(HttpClient);

  public me(): Observable<HwUser> {
    return this.httpClient.get<HwUser>('/api/users/me');
  }

  public get(ids: number[]): Observable<HwUserExt[]> {
    return this.httpClient.get<HwUserExt[]>(`/api/users/by-ids`, { params: { ids: ids } });
  }

  public availabilityEmail(params: UserAvailabilityEmailDto): Observable<boolean> {
    return this.httpClient
      .get<UserAvailabilityResponse>('/api/users/availability-email', {
        params: { ...params },
      })
      .pipe(map((availability: UserAvailabilityResponse): boolean => availability.available));
  }

  public availabilityHandle(params: UserAvailabilityHandleDto): Observable<boolean> {
    return this.httpClient
      .get<UserAvailabilityResponse>('/api/users/availability-handle', {
        params: { ...params },
      })
      .pipe(map((availability: UserAvailabilityResponse): boolean => availability.available));
  }
}
