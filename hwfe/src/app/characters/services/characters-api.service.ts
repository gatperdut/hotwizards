import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwCharacter, HwCharactersByIdsDto } from '@hw/shared';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CharactersApiService {
  private httpClient = inject(HttpClient);

  public get(params: HwCharactersByIdsDto): Observable<HwCharacter[]> {
    if (!params.ids.length) {
      return of([]);
    }

    return this.httpClient.get<HwCharacter[]>('/api/characters/by-ids', {
      params: { ...params },
    });
  }
}
