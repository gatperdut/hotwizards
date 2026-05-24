import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwAdventure } from '@hw/shared/adventures';
import { Direction } from '@hw/shared/directions';
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

  public endTurn(adventureId: number): Observable<number> {
    return this.httpClient.post<number>(`/api/adventures/${adventureId}/end-turn`, null);
  }

  public moveHero(adventureId: number, direction: Direction): Observable<void> {
    return this.httpClient.post<void>(`/api/adventures/${adventureId}/move-hero`, {
      direction: direction,
    });
  }

  public moveMonster(
    adventureId: number,
    monsterId: number,
    direction: Direction,
  ): Observable<void> {
    return this.httpClient.post<void>(`/api/adventures/${adventureId}/move-monster`, {
      monsterId: monsterId,
      direction: direction,
    });
  }
}
