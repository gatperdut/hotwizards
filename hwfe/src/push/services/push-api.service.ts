// push.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '@hw/hwfe/environments/environment';
import { EMPTY, from, Observable, switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PushApiService {
  constructor(
    private swPush: SwPush,
    private httpClient: HttpClient,
  ) {}

  public upsert(): Observable<number> {
    return from(this.swPush.requestSubscription({ serverPublicKey: environment.vapidKey })).pipe(
      switchMap((subscription) => this.httpClient.post<number>('/api/push', subscription)),
    );
  }

  public delete(): Observable<number> {
    return this.swPush.subscription.pipe(
      take(1),
      switchMap((subscription) => {
        if (!subscription) {
          return EMPTY;
        }

        return from(this.swPush.unsubscribe()).pipe(
          switchMap(() =>
            this.httpClient.delete<number>('/api/push', {
              body: { endpoint: subscription.endpoint },
            }),
          ),
        );
      }),
    );
  }
}
