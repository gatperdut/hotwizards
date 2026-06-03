import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwAdventure,
  HwAdventureMoveHeroDto,
  HwAdventureMoveMonsterDto,
  HwAdventureOpenDoorDto,
  HwAdventureSelectMonsterDto,
} from '@hw/shared/adventures';
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

  public endTurnMaster(adventureId: number): Observable<number> {
    return this.httpClient.post<number>(`/api/adventures/${adventureId}/end-turn/master`, null);
  }

  public endTurnHero(adventureId: number): Observable<number> {
    return this.httpClient.post<number>(`/api/adventures/${adventureId}/end-turn/hero`, null);
  }

  public moveHero(adventureId: number, direction: Direction): Observable<void> {
    const dto: HwAdventureMoveHeroDto = {
      direction: direction,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/move-hero`, dto);
  }

  public selectMonster(adventureId: number, monsterId: number | null): Observable<void> {
    const dto: HwAdventureSelectMonsterDto = {
      monsterId: monsterId,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/select-monster`, dto);
  }

  public moveMonster(
    adventureId: number,
    monsterId: number,
    direction: Direction,
  ): Observable<void> {
    const dto: HwAdventureMoveMonsterDto = {
      monsterId: monsterId,
      direction: direction,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/move-monster`, dto);
  }

  public openDoor(adventureId: number, direction: Direction): Observable<void> {
    const dto: HwAdventureOpenDoorDto = {
      direction: direction,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/open-door`, dto);
  }
}
