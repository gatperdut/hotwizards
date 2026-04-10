import { Injectable, ResourceRef, Signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  public availableEmailResource(
    query: Signal<string | undefined>,
  ): ResourceRef<boolean | undefined> {
    const query$ = toObservable(query).pipe(debounceTime(400));
    const debounced = toSignal(query$);

    return rxResource<boolean, string | undefined>({
      params: () => debounced(),
      stream: () => of(true).pipe(map(() => 'crb@gmail.com' !== query())),
    });
  }
}
