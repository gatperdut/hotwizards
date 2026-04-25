import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwUser,
  HwUserAvailabilityEmailDto,
  HwUserAvailabilityHandleDto,
  HwUserSearchDto,
  Paginated,
} from '@hw/shared';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private httpClient = inject(HttpClient);

  public me(): Observable<HwUser> {
    return this.httpClient.get<HwUser>('/api/users/me');
  }

  public search(params: HwUserSearchDto): Observable<Paginated<HwUser>> {
    return this.httpClient.get<Paginated<HwUser>>(`/api/users`, { params: { ...params } });
  }

  public availabilityEmail(params: HwUserAvailabilityEmailDto): Observable<boolean> {
    return this.httpClient.get<boolean>('/api/users/email-available', {
      params: { ...params },
    });
  }

  public availabilityHandle(params: HwUserAvailabilityHandleDto): Observable<boolean> {
    return this.httpClient.get<boolean>('/api/users/handle-available', {
      params: { ...params },
    });
  }
}
