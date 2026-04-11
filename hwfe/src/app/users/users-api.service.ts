import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@hw/prismagen/browser';
import {
  type UserAvailabilityEmailDto,
  type UserAvailabilityHandleDto,
  type UserAvailabilityResponseDto,
} from '@hw/shared';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private httpClient = inject(HttpClient);

  public me(): Observable<User> {
    return this.httpClient.get<User>('/api/users/me');
  }

  public get(id: number): Observable<User> {
    return this.httpClient.get<User>(`/api/users/${id}`);
  }

  public availabilityEmail(params: UserAvailabilityEmailDto): Observable<boolean> {
    return this.httpClient
      .get<UserAvailabilityResponseDto>('/api/users/availability-email', {
        params: { ...params },
      })
      .pipe(map((availability: UserAvailabilityResponseDto): boolean => availability.available));
  }

  public availabilityHandle(params: UserAvailabilityHandleDto): Observable<boolean> {
    return this.httpClient
      .get<UserAvailabilityResponseDto>('/api/users/availability-handle', {
        params: { ...params },
      })
      .pipe(map((availability: UserAvailabilityResponseDto): boolean => availability.available));
  }
}
