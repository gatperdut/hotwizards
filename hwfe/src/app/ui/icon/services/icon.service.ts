import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private httpClient = inject(HttpClient);
  private cache = new Map<string, string>();

  public getIcon(name: string): Observable<string> {
    const cached = this.cache.get(name);

    if (cached) {
      return of(cached);
    }

    return this.httpClient
      .get(`/icons/${name}.svg`, { responseType: 'text' })
      .pipe(tap((svg) => this.cache.set(name, svg)));
  }
}
