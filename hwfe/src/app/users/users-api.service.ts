import { HttpClient } from '@angular/common/http';
import { inject, Injectable, ResourceRef, Signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  type UserAvailabilityEmailDto,
  type UserAvailabilityHandleDto,
  type UserAvailabilityResponseDto,
} from '@hw/shared';
import { User } from 'hw/prismagen/browser';
import { debounceTime, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private httpClient = inject(HttpClient);

  public availableEmailResource(
    query: Signal<string | undefined>,
  ): ResourceRef<boolean | undefined> {
    const query$ = toObservable(query).pipe(debounceTime(400));
    const debounced = toSignal(query$);

    return rxResource<boolean, string | undefined>({
      params: () => debounced(),
      stream: () => of(true).pipe(map(() => 'crb@gmail.com' !== query())),
    });
  }

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
