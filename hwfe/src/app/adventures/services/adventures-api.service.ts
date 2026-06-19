import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwAdventure,
  HwAdventureDestroyItemDto,
  HwAdventureDropItemDto,
  HwAdventureEquipItemDto,
  HwAdventureMoveHeroDto,
  HwAdventureMoveMonsterDto,
  HwAdventureOpenDoorDto,
  HwAdventurePickupGoldDto,
  HwAdventurePickupItemDto,
  HwAdventureSelectMonsterDto,
  HwAdventureUnequipItemDto,
} from '@hw/shared/adventures';
import { Adjacent } from '@hw/shared/directions';
import { HwSlot } from '@hw/shared/inventory';
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

  public moveHero(adventureId: number, adjacent: Adjacent): Observable<void> {
    const dto: HwAdventureMoveHeroDto = {
      adjacent: adjacent,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/move-hero`, dto);
  }

  public selectMonster(adventureId: number, monsterId: number | null): Observable<void> {
    const dto: HwAdventureSelectMonsterDto = {
      monsterId: monsterId,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/select-monster`, dto);
  }

  public moveMonster(adventureId: number, monsterId: number, adjacent: Adjacent): Observable<void> {
    const dto: HwAdventureMoveMonsterDto = {
      monsterId: monsterId,
      adjacent: adjacent,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/move-monster`, dto);
  }

  public openDoor(adventureId: number, adjacent: Adjacent): Observable<void> {
    const dto: HwAdventureOpenDoorDto = {
      adjacent: adjacent,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/open-door`, dto);
  }

  public equipItem(adventureId: number, backpackItemId: string): Observable<void> {
    const dto: HwAdventureEquipItemDto = {
      backpackItemId: backpackItemId,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/equip-item`, dto);
  }

  public unequipItem(adventureId: number, slot: HwSlot): Observable<void> {
    const dto: HwAdventureUnequipItemDto = {
      slot: slot,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/unequip-item`, dto);
  }

  public dropItem(adventureId: number, backpackItemId: string): Observable<void> {
    const dto: HwAdventureDropItemDto = {
      backpackItemId: backpackItemId,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/drop-item`, dto);
  }

  public destroyItem(adventureId: number, backpackItemId: string): Observable<void> {
    const dto: HwAdventureDestroyItemDto = {
      backpackItemId: backpackItemId,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/destroy-item`, dto);
  }

  public pickupItem(adventureId: number, lootItemId: string): Observable<void> {
    const dto: HwAdventurePickupItemDto = {
      lootItemId: lootItemId,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/pickup-item`, dto);
  }

  public pickupGold(adventureId: number, amount: number): Observable<void> {
    const dto: HwAdventurePickupGoldDto = {
      amount: amount,
    };

    return this.httpClient.post<void>(`/api/adventures/${adventureId}/pickup-gold`, dto);
  }

  public search(adventureId: number): Observable<void> {
    return this.httpClient.post<void>(`/api/adventures/${adventureId}/search`, null);
  }
}
