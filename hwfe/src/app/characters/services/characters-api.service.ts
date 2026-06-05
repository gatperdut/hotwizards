import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwCharacterEquipItemDto, HwCharacterUnequipItemDto } from '@hw/shared/characters';
import { HwSlot } from '@hw/shared/inventory';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CharactersApiService {
  private httpClient = inject(HttpClient);

  public equipItem(characterId: number, backpackItemId: string): Observable<void> {
    const dto: HwCharacterEquipItemDto = {
      backpackItemId: backpackItemId,
    };

    return this.httpClient.post<void>(`/api/characters/${characterId}/equip-item`, dto);
  }

  public unequipItem(characterId: number, slot: HwSlot): Observable<void> {
    const dto: HwCharacterUnequipItemDto = {
      slot: slot,
    };

    return this.httpClient.post<void>(`/api/characters/${characterId}/unequip-item`, dto);
  }
}
