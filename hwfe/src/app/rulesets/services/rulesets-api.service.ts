import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HwRuleset, HwRulesetsByIdsDto } from '@hw/shared';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RulesetsApiService {
  private httpClient = inject(HttpClient);

  public get(params: HwRulesetsByIdsDto): Observable<HwRuleset[]> {
    if (!params.ids.length) {
      return of([]);
    }

    return this.httpClient.get<HwRuleset[]>('/api/rulesets/by-ids', {
      params: { ...params },
    });
  }
}
