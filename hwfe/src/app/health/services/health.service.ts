import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { type HealthStatusDto } from '@hw/shared';
import { map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private httpClient = inject(HttpClient);

  public health$ = this.httpClient.get<HealthStatusDto>('/api/health').pipe(
    map(() => true),
    // tap(() => {
    //   throw new Error('Forced HealthStatus error.');
    // }),
    shareReplay(1),
  );
}
