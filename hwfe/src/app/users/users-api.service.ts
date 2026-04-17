import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwUser,
  HwUserAvailabilityEmailDto,
  HwUserAvailabilityHandleDto,
  HwUserAvailabilityResponse,
  HwUserExt,
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

  public availabilityEmail(params: HwUserAvailabilityEmailDto): Observable<boolean> {
    return this.httpClient
      .get<HwUserAvailabilityResponse>('/api/users/availability-email', {
        params: { ...params },
      })
      .pipe(map((availability: HwUserAvailabilityResponse): boolean => availability.available));
  }

  public availabilityHandle(params: HwUserAvailabilityHandleDto): Observable<boolean> {
    return this.httpClient
      .get<HwUserAvailabilityResponse>('/api/users/availability-handle', {
        params: { ...params },
      })
      .pipe(map((availability: HwUserAvailabilityResponse): boolean => availability.available));
  }
}
