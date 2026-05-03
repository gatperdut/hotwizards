// push.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '@hw/hwfe/environments/environment';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PushService {
  constructor(
    private swPush: SwPush,
    private httpClient: HttpClient,
  ) {}

  public subscribeToNotifications(): Observable<number> {
    return from(this.swPush.requestSubscription({ serverPublicKey: environment.vapidKey })).pipe(
      switchMap((subscription) => this.httpClient.post<number>('/api/push', subscription)),
    );
  }
}
