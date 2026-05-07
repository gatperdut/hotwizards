import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwAdventureTemplate, HwAdventureTemplateSearchDto, Paginated } from '@hw/shared';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdventureTemplatesApiService {
  private httpClient = inject(HttpClient);

  public search(dto: HwAdventureTemplateSearchDto): Observable<Paginated<HwAdventureTemplate>> {
    const params: Partial<HwAdventureTemplateSearchDto> = {};

    if (dto.term) {
      params.term = dto.term;
    }

    if (dto.page) {
      params.page = dto.page;
    }

    if (dto.pageSize) {
      params.pageSize = dto.pageSize;
    }

    return this.httpClient.get<Paginated<HwAdventureTemplate>>('/api/adventure-templates', {
      params: { ...params },
    });
  }

  public get(adventureTemplateId: number): Observable<HwAdventureTemplate> {
    return this.httpClient.get<HwAdventureTemplate>(
      `/api/adventure-templates/${adventureTemplateId}`,
    );
  }
}
