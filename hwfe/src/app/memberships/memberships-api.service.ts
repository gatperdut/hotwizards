import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwMembership, HwMembershipsByIdsDto } from '@hw/shared';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MembershipsApiService {
  private httpClient = inject(HttpClient);

  public get(params: HwMembershipsByIdsDto): Observable<HwMembership[]> {
    if (!params.ids.length) {
      return of([]);
    }

    return this.httpClient.get<HwMembership[]>(`/api/memberships/by-ids`, {
      params: { ...params },
    });
  }
}
