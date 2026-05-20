import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwAdventure } from '@hw/shared/adventures';
import { Observable } from 'rxjs';
import { ApiNotificationService } from '../../services/api-notification.service';

@Injectable({ providedIn: 'root' })
export class AdventuresApiService {
  private httpClient = inject(HttpClient);
  private apiNotificationService = inject(ApiNotificationService);

  public get(adventureId: number): Observable<HwAdventure> {
    return this.httpClient.get<HwAdventure>(`/api/adventures/${adventureId}`);
  }

  public finishAdventure(adventureId: number): Observable<number> {
    return this.httpClient
      .delete<number>(`/api/adventures/${adventureId}`)
      .pipe(this.apiNotificationService.notify(undefined, 'Adventure could not be finished'));
  }

  // TODO return type
  public endTurn(adventureId: number) {
    return this.httpClient.post(`/api/adventures/${adventureId}/end-turn`, null);
  }
}
