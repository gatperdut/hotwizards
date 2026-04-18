import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwHealthStatus } from '@hw/shared';
import { map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private httpClient = inject(HttpClient);

  public health$ = this.httpClient.get<HwHealthStatus>('/api/health').pipe(
    map(() => true),
    shareReplay(1),
  );
}
