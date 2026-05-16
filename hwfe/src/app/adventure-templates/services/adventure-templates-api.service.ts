import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HwAdventureTemplate,
  HwAdventureTemplateEditDto,
  HwAdventureTemplateSearchDto,
} from '@hw/shared/adventure-templates';
import { Paginated } from '@hw/shared/pagination';
import { Observable } from 'rxjs';
import { ApiNotificationService } from '../../services/api-notification.service';

@Injectable({ providedIn: 'root' })
export class AdventureTemplatesApiService {
  private httpClient = inject(HttpClient);
  private apiNotificationService = inject(ApiNotificationService);

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

  public create(params: HwAdventureTemplateEditDto): Observable<number> {
    return this.httpClient
      .patch<number>(`/api/adventure-templates`, params)
      .pipe(
        this.apiNotificationService.notify(
          'Adventure template created',
          'Adventure template could not be created',
        ),
      );
  }

  public update(
    adventureTemplateId: number,
    params: HwAdventureTemplateEditDto,
  ): Observable<number> {
    return this.httpClient
      .patch<number>(`/api/adventure-templates/${adventureTemplateId}`, params)
      .pipe(
        this.apiNotificationService.notify(
          'Adventure template updated',
          'Adventure template could not be updated',
        ),
      );
  }
}
