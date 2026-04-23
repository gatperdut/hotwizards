import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwUser,
  HwUserAvailabilityEmailDto,
  HwUserAvailabilityHandleDto,
  HwUserAvailabilityResponse,
  HwUserSearchDto,
  Paginated,
  type HwUsersByIdsDto,
} from '@hw/shared';
import { map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private httpClient = inject(HttpClient);

  public me(): Observable<HwUser> {
    return this.httpClient.get<HwUser>('/api/users/me');
  }

  public get(params: HwUsersByIdsDto): Observable<HwUser[]> {
    if (!params.ids.length) {
      return of([]);
    }

    return this.httpClient.get<HwUser[]>(`/api/users/by-ids`, { params: { ...params } });
  }

  public search(params: HwUserSearchDto): Observable<Paginated<HwUser>> {
    return this.httpClient.get<Paginated<HwUser>>(`/api/users`, { params: { ...params } });
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
